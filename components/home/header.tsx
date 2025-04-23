"use client";
import { useSubscription } from "@/hooks/useSubcription";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { JSX } from "react";
const NavLink: ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => JSX.Element = ({ href, children }) => {
  return (
    <Link
      href={href}
      className="transition-colors duration-200 text-gray-600 hover:text-purple-500"
    >
      {children}
    </Link>
  );
};

const Header = () => {
  const { isSubscribed } = useSubscription();

  return (
    <nav
      className="container flex
     items-center justify-between
      px-8 py-4 mx-auto  "
    >
      <div className="flex lg:flex-1">
        <Link
          href="/"
          className="transi  duration-200 text-gray-600 hover:text-purple-500"
        >
          <span className="flex items-center gap-2 ">SpeakEasy</span>
        </Link>
      </div>
      <div className="flex lg:justify-center gap-2 lg:gap-12 lg:items-center">
        <NavLink href="/#pricing">Pricing</NavLink>
        <SignedIn>
          <NavLink href="/posts">Your Posts</NavLink>
        </SignedIn>
      </div>

      <div className="flex lg:justify-end lg:flex-1">
        <SignedIn>
          <div className="flex gap-2 items-center">
            {isSubscribed ? (
              <NavLink href="/dashboard">Upload a Video</NavLink>
            ) : (
              <NavLink href="#Pricing">Upload a Video</NavLink>
            )}
            <UserButton />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="px-10  text-3xl text-gray-600 bg-white">
            <NavLink href="/sign-in">Sign In</NavLink>
          </div>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Header;
