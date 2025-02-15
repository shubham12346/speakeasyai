import UpgradeYourPlan from "@/app/upload/upgrade-your-plan";
import BgGradient from "@/components/home/bgGradient";
import { Badge } from "@/components/ui/badge";
import React from "react";

const Dashboard = () => {
  let planType = "Basic";
  let hasBasicPlan = true;
  let hasUserCancel = true;
  return (
    <BgGradient>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 sm:py-8 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Badge
            className="bg-gradient-to-r from-purple-700 to-pink-800 text-white px-4 
          py-1 text-lg font-semibold capitalize"
          >
            {planType}
          </Badge>
          <h2 className="capitalize text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Start creating amazingcontent{" "}
          </h2>
          <p className="mt-2  text-lg leading-8 text-gray-600 max-w-2xl text-center ">
            {" "}
            Upload you audio or video file and let our AI do the magic !
          </p>
          <p className="mt-2 text-lg leading-8 text-gray-600 max-w-2xl text-center ">
            You get
            <span className="font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md ">
              {planType === "Basic" ? "3 " : "Unlimited "}
              blog post
            </span>
            as part of the
            <span className="font-bold capitalize"> {planType}</span> Plan.
          </p>
          {hasUserCancel ? <UpgradeYourPlan /> : "Upload"}
        </div>
      </div>
    </BgGradient>
  );
};

export default Dashboard;
