"use client";
import { ArrowRight, CheckIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import BgGradient from "./bgGradient";
import { JSX, useState } from "react";
import { useSession } from "@clerk/clerk-react";
import Script from "next/script";
import { useUser } from "@clerk/nextjs";
import { PRICING_PLANS } from "@/lib/pricingPlan";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Pricing: () => JSX.Element = () => {
  const { session } = useSession();
  const userDetails = useUser();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  if (!session) {
    return <div>Loading...</div>;
  }
  const user = session.user;
  const userEmail = user.emailAddresses[0].emailAddress;

  const handlePaymentClick = async (plan: {
    name: string;
    price: number;
    id: string;
  }) => {
    if (!userDetails.isLoaded || !user) {
      setError("Please sign in to continue");
      return;
    }

    setIsLoading(plan.id);
    setError(null);
    // Create order by calling the server endpoint
    const response = await fetch("api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planId: plan.id,
      }),
    });

    const order = await response.json();
    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      await loadRazorpayScript();
    }

    // Open Razorpay Checkout
    console.log(
      "process.env.RAZORPAY_KEY_ID",
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    );
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Replace with your Razorpay key_id
      amount: order.amount,
      currency: order.currency,
      name: "Speak Easy ",
      description: `Purchase of ${order.planName}`,
      order_id: order.orderId, // This is the order_id created in the backend
      prefill: {
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
      },
      theme: {
        color: "#F37254",
      },
      handler: function (response: any) {
        console.log("Payment successful, verifying...", response);

        fetch("api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            planId: plan.id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("data", data);
            // Use a timeout to ensure the toast is shown before redirect
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 5000);
            toast({ title: "transaction SuccessFull" });
          })
          .catch((error) => {
            console.error("Error:", error);
            setError(error);
            toast({
              title: "Payment Verification Failed",
              description: error.message || "Please contact support",
              variant: "destructive",
            });
          })
          .finally(() => {
            setIsLoading(null);
          });
      },
      modal: {
        ondismiss: function () {
          // Handle case when user closes the Razorpay modal
          console.log("Checkout form closed by user");
          setIsLoading(null);
          toast({
            title: "Payment Cancelled",
            description: "You closed the payment window",
            variant: "destructive",
          });
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  return (
    <section className="relative overflow-hidden mx-auto" id="pricing">
      <BgGradient>
        <div className="flex items-center justify-center w-full pb-6 ">
          <h2 className="font-bold text-xl uppercase mb-8 text-purple-600">
            Pricing
          </h2>
        </div>
      </BgGradient>
      <div className="flex flex-col items-center justify-center  flex-wrap lg:flex-row lg:items-stretch gap-8 ">
        {Object.values(PRICING_PLANS).map(
          ({ id, description, items, name, price }, index) => (
            <div className=" relative  max-w-md  md:w-full" key={index}>
              <div
                className={cn(
                  `relative flex flex-col h-full gap-4 lg:gap-8 p-8 rounded-box border-[1px] border-gray-500/20 rounded-2xl`,
                  id === "pro-plan" && "border-violet-500 gap-5 border-2 "
                )}
              >
                <p className="text-lg lg:text-xl font-bold capitalize">
                  {name}
                </p>
                <p className="text-base-content/80 mt-2">{description}</p>
                <div className="flex gap-2">
                  <p className="text-5xl tracking-tight font-extrabolds">
                    {price}
                  </p>
                  <div className="flex flex-col justify-end mb-[4px]">
                    <p className="text-xs text-base-content/60 uppercase font-semibold ">
                      INR
                    </p>
                    <p className="text-xs text-base-content/60 uppercase  ">
                      month
                    </p>
                  </div>
                </div>
                <ul className="space-y-2.5 leading-relaxed-flex-1">
                  {items.map((item, idx) => (
                    <li className="flex items-center gap-1" key={idx}>
                      <CheckIcon size={18}></CheckIcon>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-2">
                  <Button
                    variant={"default"}
                    className={cn(
                      "border-2 rounded-full flex gap-2 bg-black text-gray-100 aspect-square  ",
                      id === "pro" && "border-amber-300 px-4"
                    )}
                    onClick={() => handlePaymentClick({ name, price, id })}
                  >
                    <div className=" flex gap-1 items-center text-sm lg:text-2xl ">
                      Get SpeakEasy
                    </div>
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Pricing;
