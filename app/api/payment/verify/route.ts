import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // get user authenticated
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get Payments details from request
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      planId,
    } = await req.json();

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Update payment record in database
    const payment = await prisma.payment.findFirst({
      where: {
        user_email: user.emailAddresses[0].emailAddress,
        status: "PENDING",
        price_id: planId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 }
      );
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "COMPLETED",
        razorpay_payment_id,
      },
    });

    // Update user subscription status
    await prisma.user.update({
      where: { user_id: userId },
      data: {
        price_id: planId,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (err) {
    console.error("Error Verifying Payment ", err);
    return NextResponse.json(
      { error: "Failed To verify Payement" },
      { status: 500 }
    );
  }
}
