import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function hashOtp(otp: string) {
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

    const otpHash = hashOtp(otp);

    const record = await prisma.otp.findFirst({
      where: {
        phone,
        codeHash: otpHash,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    const user = await prisma.user.upsert({
      where: { phone },
      update: { verified: true },
      create: { phone, verified: true },
    });

    await prisma.otp.deleteMany({ where: { phone } });

    const res = NextResponse.json({ success: true });

    // ✅ THIS IS THE KEY
    res.cookies.set("auth-user-id", user.id, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
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
