import { BrainIcon, MoveRight } from "lucide-react";
import BgGradient from "./bgGradient";

const HowItWorks = ({}) => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="relative isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute 
      inset-x-0 -top-40 -z-10  transform-gpu overflow-hidden blur-3xl sm:top-80"
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
      <div className="flex items-center justify-center w-full pb-6 ">
        <h2 className="font-bold text-xl uppercase mb-8 text-purple-600">
          HOW IT WORKS
        </h2>
      </div>

      <h3 className="flex items-center justify-center mb-24 text-center font-bold">
        Easily repurpose your content into SEO focused blog posts
      </h3>

      <div className="flex  items-center justify-center gap-4 lg:gap-24">
        <div className="flex flex-col gap-4">
          <p className="text-7xl text-center">🎥</p>
          <p className="text-center font-medium">Upload a video</p>
        </div>
        <MoveRight size={64} strokeWidth={0.5} className="text-purple-500" />

        <div className="flex flex-col gap-4 ">
          <p className="flex items-center justify-center">
            <BrainIcon size={64} strokeWidth={0.5} />
          </p>

          <p className="text-center font-medium ">AI Magic🪄</p>
        </div>
        <MoveRight size={64} strokeWidth={0.5} className="text-purple-500" />
        <div className="flex flex-col gap-4">
          <p className="text-7xl text-center">📝</p>
          <p className="text-center font-medium">Blog</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
