import React from "react";
import { Cigarette } from "lucide-react";
import ColourfulText from "../../ui/colourful-text";

function ProgressHeader({ quitDate }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
        Your Progress <ColourfulText text="Journey" />
      </h1>
      <p className="text-lg text-gray-300 mb-4">
        Track your achievements and stay motivated on your smoke-free path
      </p>
      <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
        <Cigarette className="w-5 h-5 text-red-400 mr-2" />
        <span className="text-gray-200">
          Quit Date:{" "}
          {quitDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}

export default ProgressHeader;
