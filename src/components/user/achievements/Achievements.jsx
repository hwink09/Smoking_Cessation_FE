import React from "react";
import AchievementStats from "./AchievementStats";
import BadgeGallery from "./BadgeGallery";
import AchievementModals from "./AchievementModals";
import useBadgeAchievementsManager from "~/hooks/useBadge";
import { useAuth } from "~/hooks/useAuth";
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
  const { currentUser, loading: authLoading } = useAuth();
  const userId = currentUser?.userId || currentUser?.id;
  const token = currentUser?.token;

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
    refreshData,
  } = useBadgeAchievementsManager(userId, token);

  if (authLoading) {
    return (
      <div
        className={`${
          lightTheme ? "text-slate-800" : "min-h-screen text-white"
        } p-4 max-w-6xl mx-auto`}
      >
        <div className="flex justify-center items-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div
        className={`${
          lightTheme ? "text-slate-800" : "min-h-screen text-white"
        } p-4 max-w-6xl mx-auto`}
      >
        <div className="text-center mt-20">
          <div
            className={`${
              lightTheme ? "bg-slate-100" : "bg-white/10"
            } rounded-2xl p-8 border ${
              lightTheme ? "border-slate-200" : "border-white/20"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent">
              Đăng nhập để xem thành tựu
            </h2>
            <p
              className={`${
                lightTheme ? "text-slate-600" : "text-gray-300"
              } mb-6`}
            >
              Bạn cần đăng nhập để theo dõi tiến trình và xem các thành tựu đã
              đạt được.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
