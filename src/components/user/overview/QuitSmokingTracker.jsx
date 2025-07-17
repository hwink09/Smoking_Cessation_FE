import React, { useState } from "react";
import {
  Calendar,
  DollarSign,
  Heart,
  Award,
  Cigarette,
  Trophy,
} from "lucide-react";
import ColourfulText from "~/components/ui/colourful-text";

const QuitSmokingTracker = () => {
  const [quitDate] = useState(new Date("2024-01-15"));
  const [cigarettesPerDay] = useState(20);
  const [pricePerPack] = useState(50000);
  const [cigarettesPerPack] = useState(20);

  const calculateStats = () => {
    const now = new Date();
    const timeDiff = now.getTime() - quitDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    // Tính tiền tiết kiệm
    const cigarettesAvoided = daysDiff * cigarettesPerDay;
    const packsAvoided = cigarettesAvoided / cigarettesPerPack;
    const moneySaved = packsAvoided * pricePerPack;

    // Tính số huy hiệu (mỗi 7 ngày = 1 huy hiệu)
    const badges = Math.floor(daysDiff / 7);

    return {
      days: daysDiff,
      moneySaved: Math.round(moneySaved),
      badges: badges,
      cigarettesAvoided: cigarettesAvoided,
    };
  };

  const stats = calculateStats();

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Quit Smoking <ColourfulText text="Journey" />
          </h1>
          <p className="text-lg text-gray-300">
            Track your progress and achievements
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
            <Cigarette className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-gray-200">
              Started on: {quitDate.toLocaleDateString("en-US")}
            </span>
          </div>
        </div>

        {/* Achievement Section */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center mb-6">
            <Trophy className="w-8 h-8 text-yellow-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Achievements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm p-6 rounded-xl border border-green-400/30">
              <h3 className="text-lg font-semibold text-white mb-2">
                Cigarettes Avoided
              </h3>
              <p className="text-3xl font-bold text-green-400">
                {stats.cigarettesAvoided.toLocaleString("en-US")}
              </p>
              <p className="text-gray-300 text-sm mt-1">cigarettes</p>
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm p-6 rounded-xl border border-purple-400/30">
              <h3 className="text-lg font-semibold text-white mb-2">
                Current Level
              </h3>
              <p className="text-3xl font-bold text-purple-400">
                {Math.floor(stats.days / 30) + 1}
              </p>
              <p className="text-gray-300 text-sm mt-1">
                {stats.days < 30
                  ? "Beginner"
                  : stats.days < 90
                  ? "Persistent"
                  : stats.days < 180
                  ? "Warrior"
                  : stats.days < 365
                  ? "Master"
                  : "Legend"}
              </p>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
            <p className="text-xl text-gray-200 italic mb-2">
              "Every day without smoking is a victory!"
            </p>
            <p className="text-gray-400">
              Keep going and be proud of what you've achieved 💪
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuitSmokingTracker;
