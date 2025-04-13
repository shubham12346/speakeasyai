// app/api/auth/user/route.ts or app/actions/user.ts

import { currentUser, auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function createOrUpdateUser() {
  try {
    // Get the authenticated user from Clerk
    const user = await currentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Check if user already exists in our database
    const existingUser = await prisma.user.findUnique({
      where: {
        user_id: user.id,
      },
    });

    if (existingUser) {
      // User exists, update if needed
      // const updatedUser = await prisma.user.update({
      //   where: {
      //     user_id: user.id,
      //   },
      //   data: {
      //     fullName: `${user.firstName} ${user.lastName}`,
      //     email: user.emailAddresses[0].emailAddress,
      //   },
      // });
      // return { user: updatedUser, isNew: false };
      return { user: user.emailAddresses[0].emailAddress, isNew: false };
    } else {
      // Create new user in our database
      const newUser = await prisma.user.create({
        data: {
          user_id: user.id,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.emailAddresses[0].emailAddress,
          status: "ACTIVE",
          // customer_id and price_id will be set later when they subscribe
        },
      });
      console.log("new user registered ", newUser);
      return { user: newUser, isNew: true };
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
}

// If you're using API route approach:
export async function POST() {
  try {
    const result = await createOrUpdateUser();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
