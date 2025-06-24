import React, { useState } from "react";
import { rankings } from "~/components/generic/ranking/mockData";
import Podium from "~/components/generic/ranking/Podium";
import RankingList from "~/components/generic/ranking/RankingList";
import { Crown, Shield, PiggyBank, Award } from "lucide-react";
import { Button } from "antd";
import ColourfulText from "~/components/ui/colourful-text";

const rankingCategories = {
  smokeFree: {
    label: "Smoke-Free Streak",
    icon: <Shield size={18} />,
    data: rankings.smokeFree,
    formatter: (val) => val,
  },
  moneySaved: {
    label: "Money Saved",
    icon: <PiggyBank size={18} />,
    data: rankings.moneySaved,
    formatter: (val) => new Intl.NumberFormat("vi-VN").format(val),
  },
  badges: {
    label: "Badges Earned",
    icon: <Award size={18} />,
    data: rankings.badges,
    formatter: (val) => val,
  },
};

const RankingPage = () => {
  const [activeCategory, setActiveCategory] = useState("smokeFree");
  const currentCategory = rankingCategories[activeCategory];

  return (
    <div className="min-h-screen p-2">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <Crown className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">
            <ColourfulText text="Hall of Fame" />
          </h1>
          <p className="text-lg text-gray-300">
            Celebrating the community's greatest champions!
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 flex items-center gap-2 border border-white/20">
            {Object.keys(rankingCategories).map((key) => (
              <Button
                key={key}
                type={activeCategory === key ? "primary" : "text"}
                className={
                  activeCategory === key
                    ? "bg-purple-600 hover:bg-purple-700 rounded-full"
                    : "text-gray-300 hover:bg-white/10 rounded-full"
                }
                icon={rankingCategories[key].icon}
                onClick={() => setActiveCategory(key)}>
                {rankingCategories[key].label}
              </Button>
            ))}
          </div>
        </div>

        {/* Podium and Ranking List */}
        <div key={activeCategory}>
          <Podium
            data={currentCategory.data}
            valueFormatter={currentCategory.formatter}
          />
          <RankingList
            data={currentCategory.data}
            valueFormatter={currentCategory.formatter}
          />
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
