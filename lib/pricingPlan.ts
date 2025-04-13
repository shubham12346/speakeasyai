export interface PricingPlan {
  id: string;
  name: string;
  price: number; // in INR (or your currency)
  description: string;
  items: string[];
}

export const PRICING_PLANS: Record<string, PricingPlan> = {
  BASIC: {
    id: "basic-plan",
    name: "Basic Plan",
    price: 499,
    description: "Get Started with SpeakEasy",
    items: ["3 Blog Posts", "3 Transcription"],
  },
  PRO: {
    id: "pro-plan",
    name: "Pro Plan",
    price: 999,
    description: "All Blog Posts, let's go!",
    items: ["Unlimited Blog Posts", "Unlimited Transcription"],
  },
};
