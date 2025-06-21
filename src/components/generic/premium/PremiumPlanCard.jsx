import React from "react";
import { Button } from "antd";
import { Check } from "lucide-react";

const PremiumPlanCard = ({ plan, onSelect }) => {
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm border rounded-xl p-8 transition-all flex flex-col ${
        plan.popular
          ? "border-purple-500 relative"
          : "border-white/10 hover:border-white/30"
      }`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-fit px-4 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-sm font-medium">
          Recommended
        </div>
      )}
      <h3 className="text-2xl font-semibold mb-2 text-white">{plan.name}</h3>
      <p className="text-gray-400 mb-6 h-12">{plan.description}</p>
      <div className="mb-8">
        <span className="text-5xl font-bold text-white">{plan.price}</span>
        <span className="text-gray-400">/{plan.duration}</span>
      </div>
      <ul className="space-y-4 mb-8 flex-grow">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-1" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        type="primary"
        size="large"
        className={`w-full ${
          plan.popular
            ? "bg-purple-600 hover:bg-purple-700"
            : "bg-white/20 hover:bg-white/30"
        }`}
        onClick={() => onSelect(plan.name)}>
        Choose Plan
      </Button>
    </div>
  );
};

export default PremiumPlanCard;
