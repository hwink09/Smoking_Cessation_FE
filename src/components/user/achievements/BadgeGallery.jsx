import React from "react";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { Marquee } from "~/components/ui/Marquee";
import BadgeIcon from "../../ui/BadgeIcon";

const BadgeGallery = ({ badges = [], onView, onShare, lightTheme }) => {
  const badgesArray = Array.isArray(badges) ? badges : [];
  const earned = badgesArray.filter((b) => b && b.earned);

  const tierColors = {
    Bronze: "bg-yellow-700 text-white",
    Silver: "bg-zinc-400 text-black",
    Gold: "bg-yellow-400 text-black",
    Platinum: "bg-blue-500 text-white",
    Diamond: "bg-teal-400 text-black",
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
          Tất cả thành tựu
        </h2>
        <div
          className={`text-sm ${
            lightTheme ? "text-slate-500" : "text-gray-300"
          }`}
        >
          <span
            className={`${
              lightTheme ? "text-blue-600" : "text-blue-400"
            } font-semibold`}
          >
            {earned.length}
          </span>{" "}
          / {badgesArray.length} đã đạt
        </div>
      </div>

      <div
        className={`${
          lightTheme
            ? "bg-gradient-to-br from-white to-gray-50 border-gray-200"
            : "bg-white/10 backdrop-blur-lg border-white/20"
        } rounded-2xl p-6 border hover:border-blue-300 hover:shadow-xl transition-all duration-300`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badgesArray.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ y: -5 }}
              className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                lightTheme
                  ? badge.earned
                    ? "bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-lg hover:shadow-xl"
                    : "bg-white border-slate-200 opacity-70 hover:opacity-90"
                  : badge.earned
                  ? "bg-gradient-to-br from-white/15 to-white/5 border-white/30 shadow-lg hover:shadow-xl"
                  : "bg-white/5 border-white/10 opacity-50 hover:opacity-70"
              }`}
              onClick={() => onView(badge)}
            >
              <div className="flex justify-between mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                    tierColors[badge.tier] || "bg-gray-500 text-white"
                  } ${badge.earned ? "shadow-md scale-105" : "opacity-80"}`}
                >
                  {badge.tier}
                </span>
                {badge.earned && (
                  <div className="flex items-center text-green-500">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex items-center mb-3">
                <div
                  className={`mr-3 transition-all duration-300 ${
                    badge.earned ? "scale-110" : ""
                  }`}
                  style={{
                    filter: badge.earned
                      ? `drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))`
                      : "grayscale(100%)",
                  }}
                >
                  <BadgeIcon
                    icon={badge.icon}
                    url_image={badge.url_image}
                    size="lg"
                    earned={badge.earned}
                  />
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-semibold text-sm mb-1 ${
                      lightTheme
                        ? badge.earned
                          ? "text-slate-800"
                          : "text-slate-500"
                        : badge.earned
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  >
                    {badge.name}
                  </h4>
                  <p
                    className={`text-xs line-clamp-2 ${
                      lightTheme ? "text-slate-500" : "text-gray-400"
                    }`}
                  >
                    {badge.condition || badge.description}
                  </p>
                </div>
              </div>

              {badge.earned && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(badge);
                  }}
                  className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 8L12 2L6 8"></path>
                    <path d="M12 2L12 16"></path>
                    <rect x="2" y="16" width="20" height="6" rx="2"></rect>
                  </svg>
                  Chia sẻ thành tựu
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgeGallery;
