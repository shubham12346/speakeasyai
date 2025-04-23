import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Post = {
  summary: string | null;
  title: string;
  id: string;
  user_id: string;
  content: string;
  tags: string[];
  videoUrl: string | null;
  created_at: Date;
};
