import { ArrowRight, CheckIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Pricing = () => {
  const plansMap = [
    {
      id: "basic",
      name: "Basic",
      description: "Get Started with SpeakEasy",
      price: "10",
      items: ["3 Blog Posts", "3 Transcription"],
      paymentLink: "",
    },
    {
      id: "pro",
      name: "Pro",
      description: "All Blog Posts, let's go!",
      price: "19.99",
      items: ["Unlimited Blog Posts", "Unlimited Transcription"],
      paymentLink: "",
    },
  ];
  return (
    <section className="relative overflow-hidden mx-auto" id="pricing">
      <div className="flex items-center justify-center w-full pb-6 ">
        <h2 className="font-bold text-xl uppercase mb-8 text-purple-600">
          Pricing
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center  flex-wrap lg:flex-row lg:items-stretch gap-8 ">
        {plansMap.map(({ id, description, items, name, price }, index) => (
          <div className=" relative w-full max-w-lg " key={index}>
            <div
              className={cn(
                `relative flex flex-col h-full gap-4 lg:gap-8 p-8 rounded-box border-[1px] border-gray-500/20 rounded-2xl`,
                id === "pro" && "border-violet-500 gap-5 border-2 "
              )}
            >
              <p className="text-lg lg:text-xl font-bold capitalize">{name}</p>
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
                  variant={"link"}
                  className={cn(
                    "border-2 rounded-full flex gap-2 bg-black text-gray-100 aspect-square  ",
                    id === "pro" && "border-amber-300 px-4"
                  )}
                >
                  <Link
                    href="/"
                    className=" flex gap-1 items-center text-sm lg:text-2xl "
                  >
                    Get SpeakEasy
                  </Link>
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
