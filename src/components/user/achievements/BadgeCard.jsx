import React from "react";
import { motion } from "framer-motion";
import { Info, BadgeCheck, Share2 } from "lucide-react";
import { Tooltip, Button, Progress } from "antd";

const BadgeCard = ({ badge, onView, onShare, tierColors }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border ${
        badge.earned ? "border-white/30" : "border-white/10"
      }`}
    >
      <div className="flex justify-between">
        <div
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            tierColors[badge.tier]
          }`}
        >
          {badge.tier}
        </div>

        <Tooltip title="Badge details">
          <Info
            className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors"
            onClick={() => onView(badge)}
          />
        </Tooltip>
      </div>

      <div className="flex items-center mt-3 mb-2">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
          style={{
            background: badge.earned
              ? `radial-gradient(circle at center, ${badge.color}40 0%, ${badge.color}20 70%)`
              : "radial-gradient(circle at center, #ffffff10 0%, #ffffff05 70%)",
            border: badge.earned
              ? `2px solid ${badge.color}60`
              : "2px solid #ffffff20",
            opacity: badge.earned ? 1 : 0.6,
          }}
        >
          <span className="text-3xl">{badge.icon}</span>
        </div>

        <div>
          <h4
            className={`font-semibold ${
              badge.earned ? "text-white" : "text-gray-400"
            }`}
          >
            {badge.name}
          </h4>
          <p className="text-xs text-gray-400 line-clamp-1">
            {badge.description}
          </p>
        </div>
      </div>

      {badge.earned ? (
        <div className="flex justify-between items-center">
          <span className="text-xs text-green-500 flex items-center">
            <BadgeCheck className="w-4 h-4 mr-1" />
            Earned
          </span>

          <Button
            type="text"
            size="small"
            icon={<Share2 className="w-4 h-4 text-blue-400" />}
            onClick={() => onShare(badge)}
            className="text-blue-400 hover:text-blue-300"
          >
            Share
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{badge.progress || 0}%</span>
          </div>
          <Progress
            percent={badge.progress || 0}
            size="small"
            showInfo={false}
            strokeColor={{
              "0%": "#1890ff",
              "100%": badge.color,
            }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default BadgeCard;
