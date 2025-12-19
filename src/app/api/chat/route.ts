import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    if (!rawBody) {
      return NextResponse.json(
        { error: "Empty request body" },
        { status: 400 }
      );
    }

    let parsed: { userId: string; message: string };
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { userId, message } = parsed;

    if (!userId || !message) {
      return NextResponse.json(
        { error: "Missing userId or message" },
        { status: 400 }
      );
    }

    // Ensure user exists
    await prisma.user.upsert({
      where: { email: `${userId}@test.com` },
      update: {},
      create: {
        id: userId,
        email: `${userId}@test.com`,
      },
    });

    // Create session
    const session = await prisma.session.create({
      data: { userId },
    });

    // Save USER message
    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: "USER",
        content: message,
      },
    });

    // ✅ GROQ AI RESPONSE (FREE)
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
      "I'm here with you. Tell me more about how you're feeling.";

    // Save AI message
    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: "AI",
        content: aiReply,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      reply: aiReply,
    });
  } catch (err) {
    console.error("CHAT API ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
