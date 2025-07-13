import React from "react";
import { BadgeCheck } from "lucide-react";
import { Marquee } from "~/components/ui/Marquee"; // Giữ lại nếu bạn dùng custom Marquee
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
    <>
      <div className="mb-10">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
          Thành tựu nổi bật
        </h2>
        <div
          className={`${
            lightTheme ? "bg-slate-100" : "bg-white/5 backdrop-blur-md"
          } rounded-2xl p-3 border ${
            lightTheme ? "border-slate-200" : "border-white/10"
          }`}
        >
          <Marquee pauseOnHover>
            {earned.map((b) => (
              <motion.div
                key={b.id}
                whileHover={{ scale: 1.05 }}
                className="mx-4 cursor-pointer"
                onClick={() => onView(b)}
              >
                <div
                  className="flex flex-col items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-xl shadow-md transition-all duration-300 mb-2 overflow-hidden"
                  style={{
                    background: lightTheme
                      ? `radial-gradient(circle, ${b.color}30 0%, ${b.color}05 70%)`
                      : `radial-gradient(circle, ${b.color}40 0%, ${b.color}10 70%)`,
                    border: `2px solid ${b.color}${lightTheme ? "60" : "80"}`,
                  }}
                >
                  <div className="flex justify-center items-center h-full w-full p-2">
                    <BadgeIcon
                      icon={b.icon}
                      url_image={b.url_image}
                      size="xl"
                      earned={b.earned}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </Marquee>
        </div>
      </div>

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
            {badgesArray.map((b) => (
              <motion.div
                key={b.id}
                whileHover={{ y: -5 }}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  lightTheme
                    ? b.earned
                      ? "bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-lg"
                      : "bg-white border-slate-100 opacity-90"
                    : b.earned
                    ? "bg-gradient-to-br from-white/15 to-white/5 border-white/30 shadow-lg"
                    : "bg-white/5 border-white/10 opacity-70"
                }`}
              >
                <div className="flex justify-between mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                      tierColors[b.tier]
                    } ${b.earned ? "shadow-md scale-105" : "opacity-80"}`}
                  >
                    {b.tier}
                  </span>
                  <BadgeCheck
                    className={`w-5 h-5 cursor-pointer ${
                      lightTheme ? "hover:text-blue-700" : "hover:text-white"
                    } transition-colors ${
                      b.earned
                        ? lightTheme
                          ? "text-blue-600"
                          : "text-blue-400"
                        : lightTheme
                        ? "text-slate-400"
                        : "text-gray-400"
                    }`}
                    onClick={() => onView(b)}
                  />
                </div>

                <div className="flex items-center mb-2">
                  <div
                    className={`mr-3 transition-all duration-300 ${
                      b.earned ? "scale-110" : ""
                    }`}
                    style={{
                      filter: b.earned
                        ? `drop-shadow(0 0 3px ${b.color || "#3b82f6"})`
                        : "none",
                    }}
                  >
                    <BadgeIcon
                      icon={b.icon}
                      url_image={b.url_image}
                      size="lg"
                      earned={b.earned}
                    />
                  </div>
                  <div>
                    <h4
                      className={`font-semibold ${
                        lightTheme
                          ? b.earned
                            ? "text-slate-800"
                            : "text-slate-500"
                          : b.earned
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    >
                      {b.name}
                    </h4>
                    <p
                      className={`text-xs ${
                        lightTheme ? "text-slate-500" : "text-gray-400"
                      }`}
                    >
                      {b.description}
                    </p>
                  </div>
                </div>

                {b.earned ? (
                  <button
                    onClick={() => onShare(b)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors duration-200 flex items-center justify-center gap-1 mt-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 8L12 2L6 8"></path>
                      <path d="M12 2L12 16"></path>
                      <rect x="2" y="16" width="20" height="6" rx="2"></rect>
                    </svg>
                    Chia sẻ thành tựu
                  </button>
                ) : (
                  <div>
                    <button
                      onClick={() => onView(b)}
                      className={`px-3 py-1 ${
                        lightTheme
                          ? "bg-slate-200 hover:bg-slate-300 text-slate-700"
                          : "bg-gray-700/30 hover:bg-gray-600/50 text-gray-300"
                      } text-xs rounded-md transition-colors duration-200 flex items-center justify-center gap-1 mt-2 w-full`}
                    >
                      Xem chi tiết thành tựu
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BadgeGallery;
