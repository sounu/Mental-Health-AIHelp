import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

/* ------------------------------------------------------------------ */
/* ENV + CLIENT SETUP */
/* ------------------------------------------------------------------ */

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ------------------------------------------------------------------ */
/* CRISIS DETECTION (DETERMINISTIC, AUDITABLE) */
/* ------------------------------------------------------------------ */

function isCrisisMessage(text: string): boolean {
  const normalized = text
    .toLowerCase()
    .replace(/[-_]/g, " ");

  const crisisKeywords = [
    "kill myself",
    "suicide",
    "end my life",
    "want to die",
    "self harm",
    "hurt myself",
    "no reason to live",
    "can't go on",
    "better off dead",
  ];

  return crisisKeywords.some(keyword =>
    normalized.includes(keyword)
  );
}

/* ------------------------------------------------------------------ */
/* GET /api/chat → LOAD CHAT HISTORY */
/* ------------------------------------------------------------------ */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      select: {
        role: true,
        content: true,
      },
    });

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("CHAT HISTORY ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/* POST /api/chat → SEND MESSAGE */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    if (!rawBody) {
      return NextResponse.json(
        { error: "Empty body" },
        { status: 400 }
      );
    }

    const { userId, message, sessionId } = JSON.parse(rawBody);

    if (!userId || !message) {
      return NextResponse.json(
        { error: "Missing userId or message" },
        { status: 400 }
      );
    }

    /* -------------------------------------------------------------- */
    /* 1️⃣ ENSURE USER EXISTS */
    /* -------------------------------------------------------------- */

    await prisma.user.upsert({
      where: { email: `${userId}@test.com` },
      update: {},
      create: {
        id: userId,
        email: `${userId}@test.com`,
      },
    });

    /* -------------------------------------------------------------- */
    /* 2️⃣ GET OR CREATE SESSION */
    /* -------------------------------------------------------------- */

    const existingSession =
      sessionId
        ? await prisma.session.findUnique({
          where: { id: sessionId },
        })
        : null;

    const activeSession =
      existingSession ??
      (await prisma.session.create({
        data: { userId },
      }));

    /* -------------------------------------------------------------- */
    /* 3️⃣ SAVE USER MESSAGE */
    /* -------------------------------------------------------------- */

    await prisma.message.create({
      data: {
        sessionId: activeSession.id,
        role: "USER",
        content: message,
      },
    });

    /* -------------------------------------------------------------- */
    /* 🚨 CRISIS OVERRIDE */
    /* -------------------------------------------------------------- */

    if (isCrisisMessage(message)) {
      const crisisReply = `
I'm really sorry that you're feeling this much pain.
You are not alone, and help is available right now.

If you're in India:
📞 AASRA Helpline: +91-9820466726 (24/7)

If you're elsewhere:
🌍 https://findahelpline.com

If you feel in immediate danger, please contact local emergency services.
`;

      await prisma.message.create({
        data: {
          sessionId: activeSession.id,
          role: "AI",
          content: crisisReply,
        },
      });

      return NextResponse.json({
        sessionId: activeSession.id,
        reply: crisisReply,
        isCrisis: true,
      });
    }

    /* -------------------------------------------------------------- */
    /* 4️⃣ NORMAL AI RESPONSE (GROQ) */
    /* -------------------------------------------------------------- */

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a calm, empathetic mental health assistant. Respond supportively and safely.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const aiReply =
      completion.choices[0]?.message?.content ??
      "I'm here with you. Tell me more.";

    /* -------------------------------------------------------------- */
    /* 5️⃣ SAVE AI MESSAGE */
    /* -------------------------------------------------------------- */

    await prisma.message.create({
      data: {
        sessionId: activeSession.id,
        role: "AI",
        content: aiReply,
      },
    });

    /* -------------------------------------------------------------- */
    /* 6️⃣ RESPONSE */
    /* -------------------------------------------------------------- */

    return NextResponse.json({
      sessionId: activeSession.id,
      reply: aiReply,
      isCrisis: false,
    });
  } catch (err) {
    console.error("CHAT API ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
