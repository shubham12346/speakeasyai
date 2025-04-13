import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { PRICING_PLANS } from "@/lib/pricingPlan";
import Razorpay from "razorpay";

const prisma = new PrismaClient();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = await currentUser();
    const { planId } = await req.json();

    // Validate Plan
    const plan = Object.values(PRICING_PLANS).find((p) => p.id === planId);

    if (!plan) {
      return NextResponse.json({ error: "Invalid Plan" }, { status: 400 });
    }

    // Create Razorpay order
    const options = {
      amount: plan.price * 100, // Razorpay expects amount in smallest currency unit (paise for INR)
      currency: "INR", // Change as needed
      receipt: `receipt_${Date.now()}`,
      notes: {
        planId: plan.id,
        userId: userId,
        userEmail: user?.emailAddresses[0].emailAddress as string,
      },
    };

    const order = await razorpay.orders.create(options);
    // store order in database

    await prisma.payment.create({
      data: {
        amount: plan.price,
        status: "PENDING",
        price_id: plan.id,
        user_email: user?.emailAddresses[0].emailAddress as string,
      },
    });

    return NextResponse.json({
      orderId: order?.id,
      amount: order?.amount,
      currency: order?.currency,
      planId: plan.id,
      planName: plan.name,
    });
  } catch (err) {
    console.error("error creating order", err);
    return NextResponse.json(
      {
        error: "Failed to create order",
      },
      {
        status: 500,
      }
    );
  }
}
