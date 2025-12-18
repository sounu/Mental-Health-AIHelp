import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // ---- Safe body handling ----
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

    // ---- Ensure user exists ----
    await prisma.user.upsert({
      where: { email: `${userId}@test.com` },
      update: {},
      create: {
        id: userId,
        email: `${userId}@test.com`,
      },
    });

    // ---- Create session ----
    const session = await prisma.session.create({
      data: { userId },
    });

    // ---- Save USER message ----
    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: "USER",
        content: message,
      },
    });

    // ---- Gemini AI response (CORRECT WAY) ----
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a calm, empathetic mental health assistant.
Respond supportively and safely.

User message: ${message}`,
            },
          ],
        },
      ],
    });

    const aiReply =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text ??
      "I'm here with you. Tell me more about how you're feeling.";

    // ---- Save AI message ----
    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: "AI",
        content: aiReply,
      },
    });

    // ---- Return response ----
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
