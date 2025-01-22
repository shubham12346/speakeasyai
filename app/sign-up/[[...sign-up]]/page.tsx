import BgGradient from "@/components/home/bgGradient";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div>
      <BgGradient>
        <div className="flex items-center justify-center p-5">
          <SignUp path="/sign-up" routing="path" />
        </div>
      </BgGradient>
    </div>
  );
}
