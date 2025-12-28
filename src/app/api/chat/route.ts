import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("auth-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await prisma.session.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          select: { role: true, content: true },
        },
      },
    });

    return NextResponse.json({
      sessionId: session?.id ?? null,
      messages: session?.messages ?? [],
    });
  } catch (err) {
    console.error("CHAT GET ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("auth-user-id")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, sessionId } = await req.json();

    let session =
      sessionId
        ? await prisma.session.findUnique({ where: { id: sessionId } })
        : null;

    if (!session) {
      session = await prisma.session.create({ data: { userId } });
    }

    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: "USER",
        content: message,
      },
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: message }],
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "I'm here with you.";

    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: "AI",
        content: reply,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      reply,
    });
  } catch (err) {
    console.error("CHAT POST ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
