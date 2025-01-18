import Banner from "@/components/home/banner";
import Header from "@/components/home/header";
import HowItWorks from "@/components/home/howitworks";
import Pricing from "@/components/home/pricing";
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
      <div className="relative isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute 
      inset-x-0 -top-40 -z-10  transform-gpu overflow-hidden blur-3xl "
        >
          <div
            style={{
              clipPath:
                "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%, 50% 70%, 21% 91%, 32% 57%,2% 35%, 39% 35%)",
            }}
            className="relative let-cal[50%-11rem] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 roate-[30deg] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-30 sm:left-[calc(50%-30%rem)] sm:w-[72rem]"
          />
        </div>
      </div>

      <Header />
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
