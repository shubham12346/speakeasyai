// File: /pages/api/create-payment-link.js
import { NextResponse } from "next/server";

export async function POST(req: any) {
  try {
    // Razorpay API credentials
    console.log(req.body);
    const body = await req.json();
    const { customerEmail, plan_Id, amount, description } = await body;

    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
    if (!plan_Id) {
      return NextResponse.json(
        { error: "Plan ID is required." },
        { status: 400 }
      );
    }
    // Razorpay API URLs
    const subscriptionApi = "https://api.razorpay.com/v1/subscriptions";
    // const paymentLinkApi = "https://api.razorpay.com/v1/payment_links";

    // // 1. Create a subscription for the plan
    // const subscriptionResponse = await axios.post(
    //   subscriptionApi,
    //   {
    //     plan_id: plan_Id, // ID of the plan you created in the Razorpay dashboard
    //     customer_notify: 1, // Notify customer about the subscription
    //     total_count: 12, // Number of billing cycles (adjust as needed)
    //   },
    //   {
    //     auth: {
    //       username: RAZORPAY_KEY_ID!,
    //       password: RAZORPAY_KEY_SECRET!,
    //     },
    //   }
    // );

    // const subscription = subscriptionResponse.data;
    // console.log("step 2 ");
    // console.log("subscription", subscription);

    // const paymentLink = subscription.short_url;
    return NextResponse.json({ hello: "hello" });
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to create subscription or payment link",
        details: error.response?.data,
      },
      { status: 500 }
    );
  }
}
