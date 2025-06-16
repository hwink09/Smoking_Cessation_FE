import React from "react";
import { motion } from "framer-motion";
import { Marquee } from "~/components/ui/Marquee";

const FeaturedBadgeMarquee = ({ badges, onBadgeClick }) => {
  return (
    <div className="mb-10">
      <h3 className="text-xl font-bold text-white mb-4">
        Featured Achievements
      </h3>
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
        <Marquee pauseOnHover>
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.05 }}
              className="mx-4 cursor-pointer"
              onClick={() => onBadgeClick(badge)}
            >
              <div
                className="flex flex-col items-center justify-center w-24 h-24 rounded-full shadow-lg mb-2"
                style={{
                  background: `radial-gradient(circle at center, ${badge.color}40 0%, ${badge.color}10 70%)`,
                  border: `2px solid ${badge.color}80`,
                }}
              >
                <span className="text-4xl">{badge.icon}</span>
              </div>
              <p className="text-center text-white text-xs mt-1">
                {badge.name}
              </p>
            </motion.div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default FeaturedBadgeMarquee;
