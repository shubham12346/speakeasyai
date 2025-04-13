"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

type SubscriptionStatus = {
  isSubscribed: boolean;
  subscriptionStatus: "ACTIVE" | "CANCELLED" | string;
  plan: string | null;
  since: string | null;
  latestPayment: {
    created_at: string;
    amount: number;
    price_id: string;
  } | null;
  isLoading: boolean;
  error: string | null;
};

export function useSubscription() {
  const { isLoaded, isSignedIn } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionStatus>({
    isSubscribed: false,
    subscriptionStatus: "",
    plan: null,
    since: null,
    latestPayment: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const checkSubscription = async () => {
      if (!isLoaded || !isSignedIn) {
        setSubscriptionData((prev) => ({
          ...prev,
          isLoading: false,
        }));
        return;
      }

      try {
        const response = await fetch("/api/user/subscription");

        if (!response.ok) {
          throw new Error("Failed to fetch subscription data");
        }

        const data = await response.json();

        setSubscriptionData({
          isSubscribed: data.isSubscribed,
          subscriptionStatus: data.subscriptionStatus,
          plan: data.plan,
          since: data.since,
          latestPayment: data.latestPayment,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setSubscriptionData((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }));
      }
    };

    checkSubscription();
  }, [isLoaded, isSignedIn]);

  return subscriptionData;
}
