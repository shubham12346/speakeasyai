import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import * as fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: any) {
  const body = await req.json();
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    amount,
    currency,
  } = body;

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
      // Check if user exists
      let user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        user = await prisma.user.create({
          data: { id: userId, email: "", name: "" },
        });
      }

      // Store payment details
      await prisma.payment.create({
        data: {
          userId: userId,
          amount: amount,
          currency: currency,
          status: "success",
        },
      });
      // Create subscription
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 30); // Assuming a 30-day plan

      await prisma.subscription.create({
        data: {
          userId: userId,
          status: "active",
          startDate: startDate,
          endDate: endDate,
        },
      });

      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid token" }, { status: 500 });
    }
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
