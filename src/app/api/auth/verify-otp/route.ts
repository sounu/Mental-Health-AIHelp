import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, "");
}

function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone and OTP required" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhone(phone);
    const otpHash = hashOtp(otp);

    const otpRecord = await prisma.otp.findFirst({
      where: {
        phone: normalizedPhone,
        codeHash: otpHash,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // ✅ Create or update user
    const user = await prisma.user.upsert({
      where: { phone: normalizedPhone },
      update: { verified: true },
      create: {
        phone: normalizedPhone,
        verified: true,
      },
    });

    // Cleanup OTP
    await prisma.otp.deleteMany({ where: { phone: normalizedPhone } });

    // ✅ SET AUTH COOKIE (THIS WAS MISSING)
    const res = NextResponse.json({ success: true });

    res.cookies.set("auth-user-id", user.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
