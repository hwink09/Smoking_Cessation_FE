import React from "react";
import PremiumPlanCard from "~/components/generic/premium/PremiumPlanCard";
import { Rocket } from "lucide-react";
import { toast } from "react-toastify";

const premiumPlans = [
  {
    name: "Basic",
    price: "Free",
    duration: "month",
    description:
      "Start your journey with essential tools and community access.",
    features: [
      "Personalized Quit Plan",
      "Progress Tracking",
      "Community Forum Access",
      "Daily Motivational Messages",
    ],
    popular: false,
  },
  {
    name: "Premium",
    price: "199,000đ",
    duration: "month",
    description:
      "Unlock powerful features and get expert guidance for better results.",
    features: [
      "Everything in Basic",
      "2 One-on-one Coaching Sessions",
      "Advanced Health Analytics",
      "Relapse Prevention Tools",
      "Ad-Free Experience",
    ],
    popular: true,
  },
  {
    name: "Coach Pro",
    price: "499,000đ",
    duration: "month",
    description:
      "The ultimate package with unlimited support for those who need it most.",
    features: [
      "Everything in Premium",
      "Unlimited Coaching Sessions",
      "Dedicated Support Agent",
      "Personalized Nutrition & Fitness Tips",
      "Family Support Program",
    ],
    popular: false,
  },
];

const PremiumPage = () => {
  const handleSelectPlan = (planName) => {
    toast.info(`You have selected the ${planName} plan!`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Rocket className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Upgrade Your Journey
        </h1>
        <p className="text-lg text-gray-300 mt-2 max-w-2xl mx-auto">
          Choose a plan that fits your needs and accelerate your success to a
          smoke-free life.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {premiumPlans.map((plan) => (
          <PremiumPlanCard
            key={plan.name}
            plan={plan}
            onSelect={handleSelectPlan}
          />
        ))}
      </div>
    </div>
  );
};

export default PremiumPage;
