import React, { useState } from "react";
import { Button } from "antd";
import { Users, TrendingUp, Sparkles } from "lucide-react";

const tabs = [
  { key: "for-you", label: "For You", icon: <Sparkles size={16} /> },
  { key: "trending", label: "Trending", icon: <TrendingUp size={16} /> },
  { key: "following", label: "Following", icon: <Users size={16} /> },
];

const FilterTabs = () => {
  const [activeTab, setActiveTab] = useState("for-you");

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-2 flex items-center gap-2 mb-6">
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          type={activeTab === tab.key ? "primary" : "text"}
          className={
            activeTab === tab.key
              ? "bg-purple-600 hover:bg-purple-700"
              : "text-gray-300 hover:bg-white/10"
          }
          icon={tab.icon}
          onClick={() => setActiveTab(tab.key)}>
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default FilterTabs;
