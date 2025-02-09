"use client";
import { ArrowRight, CheckIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import BgGradient from "./bgGradient";
import { JSX } from "react";
import { useSession } from "@clerk/clerk-react";
import Script from "next/script";
import Razorpay from "razorpay";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Pricing: () => JSX.Element = () => {
  const { session } = useSession();

  if (!session) {
    return <div>Loading...</div>;
  }
  const user = session.user;
  const userEmail = user.emailAddresses[0].emailAddress;

  const plansMap = [
    {
      id: "basic",
      name: "Basic",
      description: "Get Started with SpeakEasy",
      price: "100",
      items: ["3 Blog Posts", "3 Transcription"],
      paymentLink: "",
      plan_id: process.env.NEXT_PUBLIC_BASIC_PLAN_ID,
    },
    {
      id: "pro",
      name: "Pro",
      description: "All Blog Posts, let's go!",
      price: "150",
      items: ["Unlimited Blog Posts", "Unlimited Transcription"],
      paymentLink: "",
      plan_id: process.env.NEXT_PUBLIC_PRO_PLAN_ID,
    },
  ];

  const handlePaymentClick = async (plan: {
    name: string;
    price: string;
    plan_id: string | undefined;
  }) => {
    // Create order by calling the server endpoint
    const response = await fetch("api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: plan.price,
        currency: "INR",
        receipt: "receipt#1",
        notes: {},
        plan_Id: plan.plan_id,
      }),
    });

    const order = await response.json();

    // Open Razorpay Checkout
    const options = {
      key: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay key_id
      amount: order.amount,
      currency: order.currency,
      name: "Speak Easy ",
      description: "Test Transaction",
      order_id: order.id, // This is the order_id created in the backend
      callback_url: "http://localhost:3000/", // Your success URL
      prefill: {
        name: userEmail,
        email: userEmail,
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
      handler: function (response: any) {
        fetch("api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("data", data);
            window.location.href = "/";
            alert("transaction SuccessFull");
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Error verifying payment");
          });
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <section className="relative overflow-hidden mx-auto" id="pricing">
      <Script src="https://checkout.razorpay.com/v1/checkout.js "></Script>
      <BgGradient>
        <div className="flex items-center justify-center w-full pb-6 ">
          <h2 className="font-bold text-xl uppercase mb-8 text-purple-600">
            Pricing
          </h2>
        </div>
      </BgGradient>
      <div className="flex flex-col items-center justify-center  flex-wrap lg:flex-row lg:items-stretch gap-8 ">
        {plansMap.map(
          ({ id, description, items, name, price, plan_id }, index) => (
            <div className=" relative  max-w-md  md:w-full" key={index}>
              <div
                className={cn(
                  `relative flex flex-col h-full gap-4 lg:gap-8 p-8 rounded-box border-[1px] border-gray-500/20 rounded-2xl`,
                  id === "pro" && "border-violet-500 gap-5 border-2 "
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
                      USD
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
                    onClick={() => handlePaymentClick({ name, price, plan_id })}
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
