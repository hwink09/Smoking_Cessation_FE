import React, { useState } from "react";
import {
  Trophy,
  Share2,
  Calendar,
  BadgeCheck,
  Timer,
  Zap,
  Heart,
  DollarSign,
  Info,
} from "lucide-react";
import { Progress, Button, Modal, Tooltip, message, Tabs } from "antd";
import { motion } from "framer-motion";
import { Marquee } from "~/components/ui/Marquee";
import ColourfulText from "~/components/ui/colourful-text";

const { TabPane } = Tabs;

const Achievements = () => {
  // Mock data for demonstrations - this would come from API in real implementation
  const [quitDate] = useState(new Date("2024-01-15"));
  const [cigarettesPerDay] = useState(20);
  const [pricePerPack] = useState(50000);
  const [cigarettesPerPack] = useState(20);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [badgeModalVisible, setBadgeModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const calculateStats = () => {
    const now = new Date();
    const timeDiff = now.getTime() - quitDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    const cigarettesAvoided = daysDiff * cigarettesPerDay;
    const packsAvoided = cigarettesAvoided / cigarettesPerPack;
    const moneySaved = packsAvoided * pricePerPack;
    const healthImprovement = Math.min((daysDiff / 365) * 100, 100);

    return {
      days: daysDiff,
      moneySaved: Math.round(moneySaved),
      healthImprovement: Math.round(healthImprovement * 10) / 10,
      cigarettesAvoided,
    };
  };

  const stats = calculateStats();

  // Sample badges - would be fetched from API in real implementation
  const badges = [
    // Time-based achievements (keeping a few examples)
    {
      id: 1,
      name: "First Day Free",
      description: "Complete your first day without smoking",
      category: "time",
      earned: true,
      earnedAt: "2024-01-16",
      icon: "🌱",
      color: "#52c41a",
      tier: "Bronze",
    },
    {
      id: 4,
      name: "Monthly Master",
      description: "30 days smoke-free",
      category: "time",
      earned: stats.days >= 30,
      earnedAt: stats.days >= 30 ? "2024-02-15" : null,
      progress: Math.min(Math.round((stats.days / 30) * 100), 100),
      icon: "⭐",
      color: "#1890ff",
      tier: "Silver",
    },
    {
      id: 7,
      name: "One Year Legend",
      description: "365 days smoke-free",
      category: "time",
      earned: stats.days >= 365,
      earnedAt: stats.days >= 365 ? "2025-01-15" : null,
      progress: Math.min(Math.round((stats.days / 365) * 100), 100),
      icon: "👑",
      color: "#f5222d",
      tier: "Diamond",
    },

    // Health achievements (1 example)
    {
      id: 8,
      name: "Breath of Fresh Air",
      description: "Blood oxygen levels improved after 3 days",
      category: "health",
      earned: stats.days >= 3,
      earnedAt: stats.days >= 3 ? "2024-01-18" : null,
      progress: Math.min(Math.round((stats.days / 3) * 100), 100),
      icon: "💨",
      color: "#13c2c2",
      tier: "Bronze",
    },

    // Money savings (1 example)
    {
      id: 11,
      name: "Penny Pincher",
      description: "Saved 500,000 VND",
      category: "money",
      earned: stats.moneySaved >= 500000,
      earnedAt: stats.moneySaved >= 500000 ? "2024-01-25" : null,
      progress: Math.min(Math.round((stats.moneySaved / 500000) * 100), 100),
      icon: "💰",
      color: "#faad14",
      tier: "Bronze",
    },

    // Cigarette avoidance (1 example)
    {
      id: 14,
      name: "Clean Lungs Starter",
      description: "Avoided 100 cigarettes",
      category: "avoidance",
      earned: stats.cigarettesAvoided >= 100,
      earnedAt: stats.cigarettesAvoided >= 100 ? "2024-01-20" : null,
      progress: Math.min(Math.round((stats.cigarettesAvoided / 100) * 100), 100),
      icon: "🚭",
      color: "#52c41a",
      tier: "Bronze",
    },
  ];

  const tierColors = {
    Bronze: "bg-yellow-700 text-white",
    Silver: "bg-zinc-400 text-black",
    Gold: "bg-yellow-400 text-black",
    Platinum: "bg-blue-500 text-white",
    Diamond: "bg-teal-400 text-black",
  };

  const badgesByCategory = {
    time: badges.filter((badge) => badge.category === "time"),
    health: badges.filter((badge) => badge.category === "health"),
    money: badges.filter((badge) => badge.category === "money"),
    avoidance: badges.filter((badge) => badge.category === "avoidance"),
  };

  const totalEarnedBadges = badges.filter((badge) => badge.earned).length;
  const totalBadges = badges.length;
  const completionRate = (totalEarnedBadges / totalBadges) * 100;

  const handleViewBadge = (badge) => {
    setSelectedBadge(badge);
    setBadgeModalVisible(true);
  };

  const handleShareBadge = (badge) => {
    setSelectedBadge(badge);
    setShareModalVisible(true);
    message.success(`Sharing badge: ${badge.name}`);
  };

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mb-4">
            Your <ColourfulText text="Achievements" />
          </h1>
          <p className="text-lg text-gray-300">
            Track your milestones and celebrate your smoke-free journey
          </p>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Badge Summary Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Badge Collection</h3>
              <Trophy className="w-7 h-7 text-yellow-400" />
            </div>

            <div className="flex items-baseline mb-2">
              <span className="text-3xl font-bold text-cyan-400 mr-2">
                {totalEarnedBadges}
              </span>
              <span className="text-gray-300">/ {totalBadges} earned</span>
            </div>

            <Progress
              percent={Math.round(completionRate)}
              status="active"
              strokeColor={{
                "0%": "#13c2c2",
                "100%": "#1890ff",
              }}
              className="mb-3"
            />

            <p className="text-gray-300 text-sm">
              You've earned {Math.round(completionRate)}% of all available
              achievements!
            </p>
          </div>

          {/* Ongoing Achievements */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">In Progress</h3>
              <Timer className="w-7 h-7 text-blue-400" />
            </div>

            {badges
              .filter((badge) => !badge.earned && badge.progress)
              .sort((a, b) => b.progress - a.progress)
              .slice(0, 2)
              .map((badge) => (
                <div key={badge.id} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{badge.icon}</span>
                      <span className="text-gray-200">{badge.name}</span>
                    </div>
                    <span className="text-cyan-400 font-semibold">
                      {badge.progress}%
                    </span>
                  </div>
                  <Progress
                    percent={badge.progress}
                    showInfo={false}
                    strokeColor={{
                      "0%": "#722ed1",
                      "100%": badge.color,
                    }}
                    className="mb-1"
                  />
                  <p className="text-xs text-gray-400">{badge.description}</p>
                </div>
              ))}

            {badges.filter((badge) => !badge.earned && badge.progress).length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-300">No achievements in progress</p>
              </div>
            )}
          </div>

          {/* Recent Achievements */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Recent Achievements</h3>
              <Zap className="w-7 h-7 text-yellow-400" />
            </div>

            {badges
              .filter((badge) => badge.earned)
              .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
              .slice(0, 3)
              .map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center p-2 mb-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                >
                  <span className="text-2xl mr-3">{badge.icon}</span>
                  <div>
                    <h4 className="text-gray-200">{badge.name}</h4>
                    <p className="text-xs text-gray-400">
                      Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}

            {badges.filter((badge) => badge.earned).length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-300">No achievements yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Featured Badge Marquee */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-white mb-4">Featured Achievements</h3>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <Marquee pauseOnHover>
              {badges
                .filter((badge) => badge.earned)
                .map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.05 }}
                    className="mx-4 cursor-pointer"
                    onClick={() => handleViewBadge(badge)}
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
                    <p className="text-center text-white text-xs mt-1">{badge.name}</p>
                  </motion.div>
                ))}
            </Marquee>
          </div>
        </div>

        {/* Badge Categories */}
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
                        onView={handleViewBadge}
                        onShare={handleShareBadge}
                        tierColors={tierColors}
                      />
                    ))}
                  </div>
                </TabPane>
              ))}
            </Tabs>
          </div>
        </div>

        {/* Badge Detail Modal */}
        <Modal
          title={
            selectedBadge && (
              <div className="flex items-center">
                <span className="text-2xl mr-2">{selectedBadge.icon}</span>
                <span>{selectedBadge.name}</span>
              </div>
            )
          }
          open={badgeModalVisible}
          onCancel={() => setBadgeModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setBadgeModalVisible(false)}>Close</Button>,
            selectedBadge?.earned && (
              <Button
                key="share"
                type="primary"
                icon={<Share2 className="w-4 h-4" />}
                onClick={() => handleShareBadge(selectedBadge)}
              >
                Share
              </Button>
            ),
          ]}
        >
          {selectedBadge && <BadgeDetail badge={selectedBadge} tierColors={tierColors} />}
        </Modal>

        {/* Share Modal */}
        <Modal
          title="Share Your Achievement"
          open={shareModalVisible}
          onCancel={() => setShareModalVisible(false)}
          footer={<Button onClick={() => setShareModalVisible(false)}>Close</Button>}
        >
          {selectedBadge && <ShareOptions />}
        </Modal>
      </div>
    </div>
  );
};

// Helper components
const TabHeader = ({ icon, label }) => (
  <span className="flex items-center gap-2">
    {icon}
    <span>{label}</span>
  </span>
);

const BadgeCard = ({ badge, onView, onShare, tierColors }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border ${
        badge.earned ? "border-white/30" : "border-white/10"
      }`}
    >
      <div className="flex justify-between">
        <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tierColors[badge.tier]}`}>
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
          <h4 className={`font-semibold ${badge.earned ? "text-white" : "text-gray-400"}`}>
            {badge.name}
          </h4>
          <p className="text-xs text-gray-400 line-clamp-1">{badge.description}</p>
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

const BadgeDetail = ({ badge, tierColors }) => (
  <div className="flex flex-col items-center">
    <div
      className="w-32 h-32 rounded-full flex items-center justify-center mb-4 shadow-lg"
      style={{
        background: `radial-gradient(circle at center, ${badge.color}40 0%, ${badge.color}20 70%)`,
        border: `3px solid ${badge.color}80`,
      }}
    >
      <span className="text-6xl">{badge.icon}</span>
    </div>

    <div className={`px-3 py-1 rounded-full text-xs font-semibold mb-3 ${tierColors[badge.tier]}`}>
      {badge.tier}
    </div>

    <p className="text-center mb-4">{badge.description}</p>

    {badge.earned ? (
      <p className="text-green-500 flex items-center">
        <BadgeCheck className="w-5 h-5 mr-1" />
        Earned on {new Date(badge.earnedAt).toLocaleDateString()}
      </p>
    ) : (
      <>
        <p className="text-gray-500 mb-2">Progress: {badge.progress || 0}%</p>
        <Progress percent={badge.progress || 0} status="active" strokeColor={badge.color} />
      </>
    )}
  </div>
);

const ShareOptions = () => (
  <div>
    <p>Share your achievement with friends!</p>
    <div className="flex justify-center space-x-4 my-4">
      <Button type="primary" className="bg-blue-600">Facebook</Button>
      <Button type="primary" className="bg-sky-500">Twitter</Button>
      <Button type="primary" className="bg-green-600">WhatsApp</Button>
    </div>
  </div>
);

// Helper functions
const getCategoryIcon = (category) => {
  const icons = {
    time: <Calendar className="w-5 h-5" />,
    health: <Heart className="w-5 h-5" />,
    money: <DollarSign className="w-5 h-5" />,
    avoidance: <BadgeCheck className="w-5 h-5" />,
  };
  return icons[category] || <Badge className="w-5 h-5" />;
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

export default Achievements;
