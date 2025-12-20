import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

/* ------------------------------------------------------------ */
/* SETUP */
/* ------------------------------------------------------------ */

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ------------------------------------------------------------ */
/* CRISIS DETECTION */
/* ------------------------------------------------------------ */

function isCrisisMessage(text: string): boolean {
  const normalized = text.toLowerCase();
  const keywords = [
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
  return keywords.some(k => normalized.includes(k));
}

/* ------------------------------------------------------------ */
/* GET → LOAD LATEST SESSION HISTORY (FIX) */
/* ------------------------------------------------------------ */

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("auth-user-id")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Always load latest session
    const session = await prisma.session.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!session) {
      return NextResponse.json({ messages: [] });
    }

    const messages = await prisma.message.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: "asc" },
      select: {
        role: true,
        content: true,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      messages,
    });
  } catch (err) {
    console.error("CHAT HISTORY ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------ */
/* POST → SEND MESSAGE */
/* ------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();
    const userId = req.cookies.get("auth-user-id")?.value;

    if (!userId || !message) {
      return NextResponse.json(
        { error: "Unauthorized or empty message" },
        { status: 400 }
      );
    }

    // Resolve session
    let activeSession =
      sessionId
        ? await prisma.session.findUnique({ where: { id: sessionId } })
        : null;

    if (!activeSession) {
      activeSession = await prisma.session.create({
        data: { userId },
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        sessionId: activeSession.id,
        role: "USER",
        content: message,
      },
    });

    // Crisis override
    if (isCrisisMessage(message)) {
      const crisisReply =
        "I'm really sorry you're feeling this way. Help is available. If you're in India, call AASRA: +91-9820466726. Otherwise see https://findahelpline.com";

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

    // AI response
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a calm, empathetic mental health assistant. Respond supportively and safely.",
        },
        { role: "user", content: message },
      ],
    });

    const aiReply =
      completion.choices[0]?.message?.content ??
      "I'm here with you.";

    await prisma.message.create({
      data: {
        sessionId: activeSession.id,
        role: "AI",
        content: aiReply,
      },
    });

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
