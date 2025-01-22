import Banner from "@/components/home/banner";
import BgGradient from "@/components/home/bgGradient";
import Header from "@/components/home/header";
import HowItWorks from "@/components/home/howitworks";
import Pricing from "@/components/home/pricing";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Dot } from "lucide-react";

const Divider = () => (
  <div className="flex items-center justify-center">
    <Dot className="text-purple-400"></Dot>
    <Dot className="text-purple-400"></Dot>

    <Dot className="text-purple-400"></Dot>
  </div>
);

export default function Home() {
  return (
    <main
      className=" mx-auto w-full inset-0 h-full
     bg-[radical-gradient(#e5e7eb_1px, transparent_1px)][background-size:16px_16px]"
    >
      <BgGradient />

      <Banner />
      <Divider />
      <HowItWorks />
      <Divider />
      <Pricing />
      <Divider />
      <footer className="bg-gray-200/20 flex flex-col justify-around items-center lg:flex-row  lg:justify-center lg:gap-10 h-20 px-12 z-20 relative overflow-hidden">
        <p>All Rights Reserved, {new Date().getFullYear()}</p>
        <a href="" target="_blank" className="text-lg">
          Built By Shubham
        </a>
      </footer>
    </main>
  );
}
