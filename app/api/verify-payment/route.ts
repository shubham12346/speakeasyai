import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import * as fs from "fs";

export async function POST(req: any) {
  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  const bodyWithOrderIdAndPaymentId =
    razorpay_order_id + "|" + razorpay_payment_id;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  try {
    const isValidSignature = Razorpay.validateWebhookSignature(
      bodyWithOrderIdAndPaymentId,
      razorpay_signature,
      secret as string
    );
    if (isValidSignature) {
      // Update the order with payment details
      const orders = readData();
      const order = orders.find((o: any) => o.order_id === razorpay_order_id);
      if (order) {
        order.status = "paid";
        order.payment_id = razorpay_payment_id;
        console.log("orders", orders);
      }
      return NextResponse.json({ details: "success" }, { status: 200 });
    } else {
      NextResponse.json({ message: "failed " }, { status: 500 });
    }

    return NextResponse.json({ hello: "hello" });
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Error verifying payment",
        details: error.response?.data,
      },
      { status: 500 }
    );
  }
}

// Function to read data from JSON file
const readData = () => {
  if (fs.existsSync("orders.json")) {
    const data = fs.readFileSync("orders.json", "utf8");
    return JSON.parse(data);
  }
  return [];
};
