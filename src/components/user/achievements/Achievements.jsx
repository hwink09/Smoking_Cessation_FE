import React from "react";
import AchievementStats from "./AchievementStats";
import BadgeGallery from "./BadgeGallery";
import AchievementModals from "./AchievementModals";
import useBadgeAchievementsManager from "../../../hooks/useBadgeAchievementsManager";
import BadgeIcon from "../../ui/BadgeIcon";
import ColourfulText from "~/components/ui/colourful-text";

const Achievements = ({ lightTheme = false }) => {
  const {
    // Badge data
    badges,
    stats,
    loading,
    error,
    shareBadge,

    // Modals
    selectedBadge,
    detailVisible,
    shareVisible,
    handleViewBadge,
    handleShareBadge,
    closeDetailModal,
    closeShareModal,

    // New awards
    newAwards,
    showNewAwardsModal,
    setShowNewAwardsModal,

    // Control
    refreshData,
  } = useBadgeAchievementsManager();
  return (
    <div
      className={`${
        lightTheme ? "text-slate-800" : "min-h-screen text-white"
      } p-4 max-w-6xl mx-auto`}
    >
      <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4 text-center">
        Your <ColourfulText text="Achievement" />{" "}
      </h1>
      {loading ? (
        <div className="flex justify-center my-10">
          <div className="animate-pulse flex flex-col items-center">
            <div
              className={`h-10 w-10 rounded-full ${
                lightTheme ? "bg-slate-200" : "bg-white/20"
              } mb-4`}
            ></div>
            <div
              className={`h-4 w-32 ${
                lightTheme ? "bg-slate-200" : "bg-white/20"
              } rounded`}
            ></div>
          </div>
        </div>
      ) : error ? (
        <div
          className={`${
            lightTheme
              ? "bg-red-100 border-red-300"
              : "bg-red-600/20 border-red-600/30"
          } border rounded-md p-3 mb-6`}
        >
          <p className={`${lightTheme ? "text-red-600" : "text-red-400"}`}>
            {error}
          </p>
          <button
            onClick={refreshData}
            className={`mt-2 px-4 py-1 ${
              lightTheme
                ? "bg-red-200 text-red-600 hover:bg-red-300"
                : "bg-red-600/30 text-red-400 hover:bg-red-600/40"
            } rounded`}
          >
            Try Again
          </button>
        </div>
      ) : (
        badges.length === 0 &&
        !loading &&
        !error && (
          <div
            className={`${
              lightTheme
                ? "bg-blue-50 border-blue-200"
                : "bg-blue-600/20 border-blue-600/30"
            } border rounded-md p-3 mb-6`}
          >
            <p className={`${lightTheme ? "text-blue-600" : "text-blue-400"}`}>
              No achievements yet. Continue your smoking cessation journey to
              earn achievements!
            </p>
          </div>
        )
      )}
      {/* Modal for new badge awards */}{" "}
      {showNewAwardsModal && newAwards.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div
            className={`${
              lightTheme ? "bg-white" : "bg-slate-800"
            } rounded-lg p-6 max-w-lg w-full border ${
              lightTheme ? "border-blue-300" : "border-blue-500/50"
            } shadow-lg`}
          >
            <h2
              className={`text-2xl font-bold text-center mb-4 ${
                lightTheme ? "text-slate-800" : "text-white"
              }`}
            >
              New Achievements!
            </h2>
            <p
              className={`text-center ${
                lightTheme ? "text-slate-700" : "text-white"
              } mb-6`}
            >
              Congratulations! You've earned {newAwards.length} new
              achievements.
            </p>
            <div className="max-h-60 overflow-y-auto mb-6">
              {newAwards.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex items-center p-3 mb-2 ${
                    lightTheme ? "bg-slate-100" : "bg-slate-700"
                  } rounded-lg`}
                >
                  {" "}
                  <div className="mr-3">
                    <BadgeIcon icon={badge.icon} size="lg" earned={true} />
                  </div>
                  <div>
                    <h3
                      className={`font-bold ${
                        lightTheme ? "text-blue-600" : "text-blue-400"
                      }`}
                    >
                      {badge.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        lightTheme ? "text-slate-600" : "text-slate-300"
                      }`}
                    >
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setShowNewAwardsModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}{" "}
      <AchievementStats
        badges={badges}
        stats={stats}
        onView={handleViewBadge}
        loading={loading}
        lightTheme={lightTheme}
      />
      <BadgeGallery
        badges={badges}
        onView={handleViewBadge}
        onShare={handleShareBadge}
        loading={loading}
        lightTheme={lightTheme}
      />{" "}
      <AchievementModals
        badge={selectedBadge}
        detailVisible={detailVisible}
        shareVisible={shareVisible}
        onCloseDetail={closeDetailModal}
        onCloseShare={closeShareModal}
        onShare={handleShareBadge}
        shareBadge={shareBadge}
        lightTheme={lightTheme}
      />
    </div>
  );
};

export default Achievements;
