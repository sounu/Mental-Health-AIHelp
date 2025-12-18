import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);


export async function POST(req: NextRequest) {
  try {
    // 🔒 Safe body handling
    const rawBody = await req.text();

    if (!rawBody) {
      return NextResponse.json(
        { error: "Empty request body" },
        { status: 400 }
      );
    }

    let parsed;
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

    // ✅ Ensure user exists
    await prisma.user.upsert({
      where: { email: `${userId}@test.com` },
      update: {},
      create: {
        id: userId,
        email: `${userId}@test.com`,
      },
    });

    // ✅ Create session
    const session = await prisma.session.create({
      data: { userId },
    });

    // ✅ Save message
    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: "USER",
        content: message,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error("CHAT API ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
