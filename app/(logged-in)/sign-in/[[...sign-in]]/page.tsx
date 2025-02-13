import BgGradient from "@/components/home/bgGradient";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div>
      <BgGradient>
        <div className="flex items-center justify-center p-5">
          <SignIn path="/sign-in" routing="path" />
        </div>
      </BgGradient>
    </div>
  );
}
