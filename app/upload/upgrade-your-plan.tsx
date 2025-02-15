import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const UpgradeYourPlan = () => {
  return (
    <div
      className="div flex flex-col justify-center
  text-center gap-6"
    >
      <p
        className="mt-2  text-lg leading-8 text-gray-600 max-w-2xl text-center  
      border-2 border-red-200 bg-red-100 p-4 rounded-lg border-dashed"
      >
        You need to have to the Basic Plan or the Pro Plan to create blog posts
        with the power of AI ❤️.
      </p>
      <Link
        href="/#pricing"
        className="flex gap-2 items-center  justify-center text-purple-600 font-semibold  "
      >
        Go to Pricing
        <ArrowRight className="w-4 h-4" />{" "}
      </Link>
    </div>
  );
};

export default UpgradeYourPlan;
