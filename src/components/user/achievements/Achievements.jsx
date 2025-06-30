import React from "react";
import AchievementStats from "./AchievementStats";
import BadgeGallery from "./BadgeGallery";
import AchievementModals from "./AchievementModals";
import useBadgeAchievementsManager from "~/hooks/useBadge";
import BadgeIcon from "~/components/ui/BadgeIcon";
import ColourfulText from "~/components/ui/colourful-text";

const styles = {
  modalTitle: {
    background: "linear-gradient(to right, #7e22ce, #2563eb, #0ea5e9)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  },
  modalContent: {
    background: "linear-gradient(to bottom right, #ffffff, #f9fafb)",
  },
};

const Achievements = ({ lightTheme = false }) => {
  const {
    badges,
    stats,
    loading,
    error,
    shareBadge,
    selectedBadge,
    detailVisible,
    shareVisible,
    handleViewBadge,
    handleShareBadge,
    closeDetailModal,
    closeShareModal,
    newAwards,
    showNewAwardsModal,
    setShowNewAwardsModal,
    refreshData,
  } = useBadgeAchievementsManager();

  return (
    <div
      className={`${
        lightTheme ? "text-slate-800" : "min-h-screen text-white"
      } p-4 max-w-6xl mx-auto`}
    >
      <div className="text-center mb-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8 rounded-2xl shadow-md border border-blue-200">
        <div className="relative mb-10">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"></div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200 inline-block">
            Thành tựu <ColourfulText text="của bạn" />
          </h1>

          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Theo dõi tiến trình và ăn mừng các cột mốc trên hành trình bỏ thuốc
            của bạn!
          </p>
        </div>

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
              Thử lại
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
              <p
                className={`${lightTheme ? "text-blue-600" : "text-blue-400"}`}
              >
                Bạn chưa có thành tựu nào. Hãy tiếp tục hành trình bỏ thuốc để
                đạt được nhé!
              </p>
            </div>
          )
        )}
      </div>

      {/* Modal cho huy hiệu mới */}
      {showNewAwardsModal && newAwards.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div
            className={`${
              lightTheme
                ? "bg-gradient-to-br from-white to-gray-50"
                : "bg-slate-800"
            } rounded-lg p-6 max-w-lg w-full border ${
              lightTheme
                ? "border-blue-300 hover:border-blue-400"
                : "border-blue-500/50"
            } shadow-lg hover:shadow-xl transition-all duration-300`}
          >
            <h2
              className={`text-2xl font-bold text-center mb-4 ${
                lightTheme ? "text-slate-800" : "text-white"
              }`}
            >
              Thành tựu mới!
            </h2>
            <p
              className={`text-center ${
                lightTheme ? "text-slate-700" : "text-white"
              } mb-6`}
            >
              Xin chúc mừng! Bạn vừa nhận được {newAwards.length} thành tựu mới.
            </p>
            <div className="max-h-60 overflow-y-auto mb-6">
              {newAwards.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex items-center p-3 mb-2 ${
                    lightTheme
                      ? "bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-300"
                      : "bg-slate-700"
                  } rounded-lg hover:shadow-md transition-all duration-300`}
                >
                  <div className="mr-3 bg-gradient-to-br from-white to-gray-50 p-1 rounded-full shadow-sm hover:shadow-md border border-gray-200 hover:border-blue-300 transition-all duration-300 badge-icon-container hover:scale-105">
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
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-md hover:shadow-lg border border-blue-700 hover:border-blue-800 transition-all duration-300"
              >
                Tuyệt vời!
              </button>
            </div>
          </div>
        </div>
      )}

      <AchievementStats
        badges={badges}
        stats={stats}
        onView={handleViewBadge}
        loading={loading}
        lightTheme={lightTheme}
        progressClasses={{
          wrapper: "group",
          progress: "transition-all duration-500 ease-in-out",
          bar: "group-hover:shadow-[0_0_8px_rgba(24,144,255,0.5)]",
        }}
      />

      <BadgeGallery
        badges={badges}
        onView={handleViewBadge}
        onShare={handleShareBadge}
        loading={loading}
        lightTheme={lightTheme}
        badgeClasses={{
          container:
            "transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg",
        }}
      />

      <AchievementModals
        badge={selectedBadge}
        detailVisible={detailVisible}
        shareVisible={shareVisible}
        onCloseDetail={closeDetailModal}
        onCloseShare={closeShareModal}
        onShare={handleShareBadge}
        shareBadge={shareBadge}
        lightTheme={lightTheme}
        customStyles={styles}
        modalClasses={{
          modal:
            "achievement-modal rounded-2xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-300 ease-in-out",
          header: "bg-transparent border-b border-slate-200 px-6 py-4",
          title: "font-bold text-xl",
          content: "",
          footer: "border-t border-slate-200 px-6 py-4 flex justify-end",
          button: "transition-all duration-300 ease-in-out rounded-md",
        }}
      />
    </div>
  );
};

export default Achievements;
