// lib/auth.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Function to create user in your database
const createUser = async (userId: string, email: string, name: string) => {
  const user = await prisma.user.create({
    data: {
      id: userId,
      email,
      name,
    },
  });
  console.log("user created");
  return user;
};

// Function to handle sign-in logic
export const handleSignIn = async (clerkUser: any) => {
  const { id: userId, primaryEmailAddress, firstName, lastName } = clerkUser;
  let email = primaryEmailAddress.emailAddress;

  console.log("userId:", userId, "email:", email, "firstName:", firstName);
  // Check if user exists in database
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    // If user doesn't exist, create user record
    await createUser(userId, email, `${firstName} ${lastName}`);
  }

  // You can also handle any additional logic here, like initializing subscriptions
};
