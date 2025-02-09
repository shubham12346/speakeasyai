import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: any) {
  try {
    // Razorpay API credentials
    console.log(req.body);
    const body = await req.json();
    const { customerEmail, plan_Id, amount, description } = await body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    if (!plan_Id) {
      return NextResponse.json(
        { error: "Plan ID is required." },
        { status: 400 }
      );
    }
    console.log("plan_Id", plan_Id);
    const options = {
      amount: amount * 100, // Convert amount to paise
      currency: "INR",
    };
    console.log("order", options);
    const order = await razorpay.orders.create(options);

    console.log("orders", order);
    return NextResponse.json(order); // Send order details to frontend, including order ID
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: error + "Failed to create subscription or payment link",
        details: error,
      },
      { status: 500 }
    );
  }
}
