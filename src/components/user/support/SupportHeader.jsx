import React from "react";
import ColourfulText from "~/components/ui/colourful-text";

const SupportHeader = () => (
  <div className="text-center mb-8">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
      Support & <ColourfulText text="Resources" />
    </h1>
    <p className="text-lg text-gray-300">
      We're here to help on your quit journey
    </p>
  </div>
);

export default SupportHeader;
