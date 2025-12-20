import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, "");
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashOtp(otp: string): string {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phoneRaw = body.phone;

    if (!phoneRaw) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const phone = normalizePhone(phoneRaw);

    // Generate OTP
    const otp = generateOtp();
    const codeHash = hashOtp(otp);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP (delete old ones first)
    await prisma.otp.deleteMany({
      where: { phone },
    });

    await prisma.otp.create({
      data: {
        phone,
        codeHash,
        expiresAt,
      },
    });

    // 🔥 MOCK SMS (log to console)
    console.log(`📨 OTP for ${phone}: ${otp}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
