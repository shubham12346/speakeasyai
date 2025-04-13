"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";

export default function UserSync() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();

  useEffect(() => {
    // Only run when both auth and user are loaded and user is signed in
    if (isAuthLoaded && isUserLoaded && isSignedIn && user) {
      const syncUser = async () => {
        try {
          // Call the API endpoint
          await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            }),
          });
          console.log("User synced with database");
        } catch (error) {
          console.error("Failed to sync user with database:", error);
        }
      };

      syncUser();
    }
  }, [isAuthLoaded, isUserLoaded, isSignedIn, user]);

  return null; // This component doesn't render anything
}
