import React from "react";
import { Tabs } from "antd";
import { Calendar, Heart, DollarSign, BadgeCheck } from "lucide-react";
import BadgeCard from "./BadgeCard";

const { TabPane } = Tabs;

const BadgeCategoriesTabs = ({
  badgesByCategory,
  onViewBadge,
  onShareBadge,
}) => {
  const tierColors = {
    Bronze: "bg-yellow-700 text-white",
    Silver: "bg-zinc-400 text-black",
    Gold: "bg-yellow-400 text-black",
    Platinum: "bg-blue-500 text-white",
    Diamond: "bg-teal-400 text-black",
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-white mb-4">All Achievements</h3>
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
        <Tabs defaultActiveKey="time" type="card" className="achievements-tabs">
          {Object.entries(badgesByCategory).map(([category, badges]) => (
            <TabPane
              key={category}
              tab={
                <TabHeader
                  icon={getCategoryIcon(category)}
                  label={getCategoryLabel(category)}
                />
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {badges.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    onView={onViewBadge}
                    onShare={onShareBadge}
                    tierColors={tierColors}
                  />
                ))}
              </div>
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

const TabHeader = ({ icon, label }) => (
  <span className="flex items-center gap-2">
    {icon}
    <span>{label}</span>
  </span>
);

// Helper functions
const getCategoryIcon = (category) => {
  const icons = {
    time: <Calendar className="w-5 h-5" />,
    health: <Heart className="w-5 h-5" />,
    money: <DollarSign className="w-5 h-5" />,
    avoidance: <BadgeCheck className="w-5 h-5" />,
  };
  return icons[category] || <BadgeCheck className="w-5 h-5" />;
};

const getCategoryLabel = (category) => {
  const labels = {
    time: "Time Milestones",
    health: "Health Benefits",
    money: "Money Saved",
    avoidance: "Cigarettes Avoided",
  };
  return labels[category] || category;
};

export default BadgeCategoriesTabs;
