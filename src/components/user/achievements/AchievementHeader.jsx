import React from "react";
import ColourfulText from "~/components/ui/colourful-text";

const AchievementHeader = () => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mb-4">
        Your <ColourfulText text="Achievements" />
      </h1>
      <p className="text-lg text-gray-300">
        Track your milestones and celebrate your smoke-free journey
      </p>
    </div>
  );
};

export default AchievementHeader;
