import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Verify authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's subscription status from the database
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        status: true,
        price_id: true,
        created_at: true,
        // You can include more fields if needed
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the most recent completed payment for additional details
    const latestPayment = await prisma.payment.findFirst({
      where: {
        user_email: user?.email,
        status: "COMPLETED",
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        created_at: true,
        amount: true,
        price_id: true,
      },
    });

    // Determine if the user has an active subscription
    const isSubscribed = user.status === "ACTIVE" && user.price_id !== null;

    return NextResponse.json({
      isSubscribed,
      subscriptionStatus: user.status,
      plan: user.price_id,
      since: user.created_at,
      latestPayment: latestPayment || null,
    });
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return NextResponse.json(
      { error: "Failed to check subscription status" },
      { status: 500 }
    );
  }
}
