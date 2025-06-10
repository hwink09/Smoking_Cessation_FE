import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Rate,
  Timeline,
  Badge as AntBadge,
  Progress as AntProgress,
  Tabs,
  List,
  message,
  Popconfirm,
} from "antd";
import {
  Calendar,
  DollarSign,
  Heart,
  Award,
  Cigarette,
  Trophy,
  TrendingUp,
  Target,
  Clock,
  MessageCircle,
  Share2,
  BookOpen,
  Star,
  Gift,
  Users,
  Activity,
} from "lucide-react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ShareAltOutlined,
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import { LineChart } from "../../ui/line-chart";
import { AreaChart } from "../../ui/area-chart";
import { BarChart } from "../../ui/bar-chart";
import { PieChart } from "../../ui/pie-chart";
import ColourfulText from "../../ui/colourful-text";
import dayjs from "dayjs";

const { TextArea } = Input;
const { TabPane } = Tabs;

function Progress() {
  // State management
  const [quitDate] = useState(new Date("2024-01-15"));
  const [cigarettesPerDay] = useState(20);
  const [pricePerPack] = useState(50000);
  const [cigarettesPerPack] = useState(20);
  const [journalEntries, setJournalEntries] = useState([]);
  const [isJournalModalVisible, setIsJournalModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [form] = Form.useForm();
  const [motivationalMessages] = useState([
    "You're doing amazing! Every smoke-free day is a victory! 🎉",
    "Your lungs are thanking you right now! Keep going! 💪",
    "Remember why you started - your health is worth it! ❤️",
    "Each day without smoking is an investment in your future! 🌟",
    "You're stronger than your cravings! Stay focused! 🎯",
  ]);

  // Mock data for demonstrations
  const [badges] = useState([
    {
      id: 1,
      name: "7 Days Strong",
      description: "7 days smoke-free",
      earned: true,
      earnedAt: "2024-01-22",
      icon: "🏆",
      color: "#52c41a",
    },
    {
      id: 2,
      name: "Money Saver",
      description: "Saved $100",
      earned: true,
      earnedAt: "2024-01-25",
      icon: "💰",
      color: "#1890ff",
    },
    {
      id: 3,
      name: "Health Warrior",
      description: "30 days smoke-free",
      earned: false,
      progress: 70,
      icon: "❤️",
      color: "#f5222d",
    },
    {
      id: 4,
      name: "Champion",
      description: "90 days smoke-free",
      earned: false,
      progress: 23,
      icon: "🎖️",
      color: "#faad14",
    },
    {
      id: 5,
      name: "Master",
      description: "365 days smoke-free",
      earned: false,
      progress: 6,
      icon: "🌟",
      color: "#722ed1",
    },
  ]);

  const [quitHistory] = useState([
    {
      date: "2024-01-15",
      event: "Quit Date",
      type: "success",
      description: "Started your smoke-free journey!",
    },
    {
      date: "2024-01-22",
      event: "First Week",
      type: "success",
      description: "Completed 7 days without smoking",
    },
    {
      date: "2024-01-25",
      event: "Money Milestone",
      type: "success",
      description: "Saved your first $100",
    },
    {
      date: "2024-02-01",
      event: "Relapse",
      type: "warning",
      description: "Had 2 cigarettes but got back on track",
    },
    {
      date: "2024-02-14",
      event: "30 Days",
      type: "success",
      description: "One month smoke-free milestone!",
    },
  ]);

  // Calculate progress statistics
  const calculateStats = () => {
    const now = new Date();
    const timeDiff = now.getTime() - quitDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    const cigarettesAvoided = daysDiff * cigarettesPerDay;
    const packsAvoided = cigarettesAvoided / cigarettesPerPack;
    const moneySaved = packsAvoided * pricePerPack;
    const healthImprovement = Math.min((daysDiff / 365) * 100, 100);
    const badgesEarned = badges.filter((b) => b.earned).length;

    return {
      days: daysDiff,
      moneySaved: Math.round(moneySaved),
      healthImprovement: Math.round(healthImprovement * 10) / 10,
      badgesEarned: badgesEarned,
      cigarettesAvoided: cigarettesAvoided,
      progressPercentage: Math.min((daysDiff / 365) * 100, 100),
    };
  };

  const stats = calculateStats();

  // Mock data for charts
  const weeklyProgressData = [
    { week: "Week 1", smokeFree: 5, cravings: 8, mood: 6 },
    { week: "Week 2", smokeFree: 7, cravings: 6, mood: 7 },
    { week: "Week 3", smokeFree: 7, cravings: 4, mood: 8 },
    { week: "Week 4", smokeFree: 7, cravings: 3, mood: 8 },
    { week: "Week 5", smokeFree: 7, cravings: 2, mood: 9 },
    { week: "Week 6", smokeFree: 7, cravings: 2, mood: 9 },
  ];

  const monthlyProgressData = [
    { month: "Jan", days: 17, money: 425000 },
    { month: "Feb", days: 28, money: 700000 },
    { month: "Mar", days: 31, money: 775000 },
    { month: "Apr", days: 30, money: 750000 },
    { month: "May", days: 31, money: 775000 },
    { month: "Jun", days: 10, money: 250000 },
  ];

  const healthImprovementData = [
    { metric: "Lung Function", improvement: 85 },
    { metric: "Circulation", improvement: 92 },
    { metric: "Oxygen Levels", improvement: 88 },
    { metric: "Energy", improvement: 78 },
    { metric: "Sleep Quality", improvement: 82 },
  ];

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Progress overview cards
  const overviewCards = [
    {
      title: "Smoke-Free Days",
      value: stats.days,
      unit: "days",
      icon: Calendar,
      bgColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
      textColor: "text-emerald-400",
      emoji: "✅",
    },
    {
      title: "Money Saved",
      value: formatMoney(stats.moneySaved),
      unit: "",
      icon: DollarSign,
      bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
      textColor: "text-blue-400",
      emoji: "💰",
    },
    {
      title: "Health Progress",
      value: stats.healthImprovement,
      unit: "%",
      icon: Heart,
      bgColor: "bg-gradient-to-br from-pink-500 to-rose-600",
      textColor: "text-pink-400",
      emoji: "❤️",
    },
    {
      title: "Badges Earned",
      value: stats.badgesEarned,
      unit: "badges",
      icon: Award,
      bgColor: "bg-gradient-to-br from-yellow-500 to-orange-600",
      textColor: "text-yellow-400",
      emoji: "🏅",
    },
  ];

  // Journal entry handlers
  const handleAddJournalEntry = () => {
    setEditingEntry(null);
    form.resetFields();
    setIsJournalModalVisible(true);
  };

  const handleEditJournalEntry = (entry) => {
    setEditingEntry(entry);
    form.setFieldsValue({
      ...entry,
      date: dayjs(entry.date),
    });
    setIsJournalModalVisible(true);
  };

  const handleDeleteJournalEntry = (entryId) => {
    setJournalEntries((prev) => prev.filter((entry) => entry.id !== entryId));
    message.success("Journal entry deleted successfully");
  };

  const handleJournalSubmit = (values) => {
    const entryData = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
      id: editingEntry ? editingEntry.id : Date.now(),
    };

    if (editingEntry) {
      setJournalEntries((prev) =>
        prev.map((entry) => (entry.id === editingEntry.id ? entryData : entry))
      );
      message.success("Journal entry updated successfully");
    } else {
      setJournalEntries((prev) => [entryData, ...prev]);
      message.success("Journal entry added successfully");
    }

    setIsJournalModalVisible(false);
    form.resetFields();
  };

  const handleShareBadge = (badge) => {
    // Mock sharing functionality
    message.success(`Badge "${badge.name}" shared successfully!`);
  };

  const handleShareProgress = () => {
    // Mock sharing functionality
    message.success("Progress shared to community!");
  };

  const getMoodIcon = (mood) => {
    if (mood >= 8) return <SmileOutlined style={{ color: "#52c41a" }} />;
    if (mood >= 5) return <MehOutlined style={{ color: "#faad14" }} />;
    return <FrownOutlined style={{ color: "#f5222d" }} />;
  };

  const getHealthStatusColor = (status) => {
    const colors = {
      excellent: "#52c41a",
      good: "#1890ff",
      fair: "#faad14",
      poor: "#f5222d",
    };
    return colors[status] || "#d9d9d9";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Your Progress <ColourfulText text="Journey" />
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            Track your achievements and stay motivated on your smoke-free path
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
            <Cigarette className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-gray-200">
              Quit Date:{" "}
              {quitDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Progress Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${card.bgColor} p-3 rounded-xl shadow-md`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl">{card.emoji}</span>
                </div>

                <h3 className="text-gray-300 text-sm font-medium mb-2">
                  {card.title}
                </h3>

                <div className="flex items-baseline">
                  <span className={`${card.textColor} text-3xl font-bold`}>
                    {typeof card.value === "string"
                      ? card.value
                      : card.value.toLocaleString("en-US")}
                  </span>
                  {card.unit && (
                    <span className="text-gray-400 text-sm ml-2">
                      {card.unit}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall Progress Bar */}
        <Card
          className="mb-8 bg-white/10 backdrop-blur-sm border border-white/20"
          bodyStyle={{ padding: "24px" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Target className="w-6 h-6 mr-2" />
              Annual Progress Goal
            </h2>
            <Button
              type="primary"
              icon={<Share2 className="w-4 h-4" />}
              onClick={handleShareProgress}
              className="bg-gradient-to-r from-purple-500 to-pink-500 border-none"
            >
              Share Progress
            </Button>
          </div>
          <AntProgress
            percent={Math.round(stats.progressPercentage)}
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
            size="large"
            format={(percent) => `${percent}% Complete`}
          />
          <p className="text-gray-300 mt-2">
            You're {Math.round(stats.progressPercentage)}% of the way to your
            one-year smoke-free goal!
          </p>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultActiveKey="1" className="custom-tabs">
          {/* Statistics & Charts Tab */}
          <TabPane
            tab={
              <span className="text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                Statistics & Charts
              </span>
            }
            key="1"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card
                title={
                  <span className="text-white">Weekly Progress Trends</span>
                }
                className="bg-white/10 backdrop-blur-sm border border-white/20"
                headStyle={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
              >
                <LineChart
                  data={weeklyProgressData}
                  index="week"
                  categories={["smokeFree", "mood"]}
                  colors={["#52c41a", "#1890ff"]}
                  valueFormatter={(value) => `${value}`}
                />
              </Card>

              <Card
                title={<span className="text-white">Monthly Money Saved</span>}
                className="bg-white/10 backdrop-blur-sm border border-white/20"
                headStyle={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
              >
                <BarChart
                  data={monthlyProgressData}
                  index="month"
                  categories={["money"]}
                  colors={["#1890ff"]}
                  valueFormatter={(value) => `${value / 1000}k VND`}
                />
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card
                title={
                  <span className="text-white">
                    Craving Intensity Over Time
                  </span>
                }
                className="bg-white/10 backdrop-blur-sm border border-white/20"
                headStyle={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
              >
                <AreaChart
                  data={weeklyProgressData}
                  index="week"
                  categories={["cravings"]}
                  colors={["#f5222d"]}
                  valueFormatter={(value) => `Level ${value}`}
                />
              </Card>

              <Card
                title={<span className="text-white">Health Improvements</span>}
                className="bg-white/10 backdrop-blur-sm border border-white/20"
                headStyle={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
              >
                <PieChart
                  data={healthImprovementData.map((item) => ({
                    name: item.metric,
                    value: item.improvement,
                  }))}
                  colors={[
                    "#52c41a",
                    "#1890ff",
                    "#faad14",
                    "#f5222d",
                    "#722ed1",
                  ]}
                />
              </Card>
            </div>
          </TabPane>

          {/* Daily Journal Tab */}
          <TabPane
            tab={
              <span className="text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Daily Journal
              </span>
            }
            key="2"
          >
            <div className="mb-6">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddJournalEntry}
                size="large"
                className="bg-gradient-to-r from-green-500 to-blue-500 border-none"
              >
                Add New Entry
              </Button>
            </div>

            <div className="grid gap-4">
              {journalEntries.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Journal Entries Yet
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Start documenting your smoke-free journey!
                  </p>
                  <Button
                    type="primary"
                    onClick={handleAddJournalEntry}
                    className="bg-gradient-to-r from-green-500 to-blue-500 border-none"
                  >
                    Create Your First Entry
                  </Button>
                </Card>
              ) : (
                journalEntries.map((entry) => (
                  <Card
                    key={entry.id}
                    className="bg-white/10 backdrop-blur-sm border border-white/20"
                    actions={[
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditJournalEntry(entry)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </Button>,
                      <Popconfirm
                        title="Are you sure you want to delete this entry?"
                        onConfirm={() => handleDeleteJournalEntry(entry.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white">
                        {entry.date}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {getMoodIcon(entry.mood)}
                        <span
                          className="px-2 py-1 rounded text-xs font-medium text-white"
                          style={{
                            backgroundColor: getHealthStatusColor(
                              entry.healthStatus
                            ),
                          }}
                        >
                          {entry.healthStatus?.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-gray-400 text-sm">
                          Cigarettes
                        </span>
                        <p className="text-white font-medium">
                          {entry.cigarettes || 0}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Mood</span>
                        <p className="text-white font-medium">
                          {entry.mood}/10
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Cravings</span>
                        <p className="text-white font-medium">
                          {entry.cravings || 0}/10
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Exercise</span>
                        <p className="text-white font-medium">
                          {entry.exercise || 0} min
                        </p>
                      </div>
                    </div>

                    {entry.notes && (
                      <div>
                        <span className="text-gray-400 text-sm">Notes:</span>
                        <p className="text-white mt-1">{entry.notes}</p>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabPane>

          {/* Achievements & Badges Tab */}
          <TabPane
            tab={
              <span className="text-white">
                <Trophy className="w-4 h-4 mr-2" />
                Achievements
              </span>
            }
            key="3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <Card
                  key={badge.id}
                  className={`bg-white/10 backdrop-blur-sm border transition-all duration-300 ${
                    badge.earned
                      ? "border-green-400/50 shadow-lg shadow-green-400/20"
                      : "border-white/20"
                  }`}
                  actions={
                    badge.earned
                      ? [
                          <Button
                            type="text"
                            icon={<ShareAltOutlined />}
                            onClick={() => handleShareBadge(badge)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Share
                          </Button>,
                        ]
                      : []
                  }
                >
                  <div className="text-center">
                    <div
                      className={`text-6xl mb-4 ${
                        badge.earned ? "" : "grayscale opacity-50"
                      }`}
                    >
                      {badge.icon}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                      {badge.name}
                      {badge.earned && (
                        <AntBadge
                          count="✓"
                          style={{ backgroundColor: "#52c41a", marginLeft: 8 }}
                        />
                      )}
                    </h3>

                    <p className="text-gray-300 mb-4">{badge.description}</p>

                    {badge.earned ? (
                      <div className="text-green-400 font-medium">
                        <Gift className="w-4 h-4 inline mr-1" />
                        Earned on {badge.earnedAt}
                      </div>
                    ) : (
                      <div>
                        <AntProgress
                          percent={badge.progress}
                          strokeColor={badge.color}
                          size="small"
                          className="mb-2"
                        />
                        <p className="text-gray-400 text-sm">
                          {badge.progress}% complete
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabPane>

          {/* Motivational Reminders Tab */}
          <TabPane
            tab={
              <span className="text-white">
                <Star className="w-4 h-4 mr-2" />
                Motivation
              </span>
            }
            key="4"
          >
            <div className="grid gap-6">
              {/* Daily Motivation */}
              <Card
                title={
                  <span className="text-white flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Daily Motivation
                  </span>
                }
                className="bg-white/10 backdrop-blur-sm border border-white/20"
                headStyle={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🌟</div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {
                      motivationalMessages[
                        Math.floor(Math.random() * motivationalMessages.length)
                      ]
                    }
                  </h3>
                  <Button
                    type="primary"
                    size="large"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 border-none"
                  >
                    Get New Motivation
                  </Button>
                </div>
              </Card>

              {/* Quit Reasons Reminder */}
              <Card
                title={
                  <span className="text-white flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Remember Why You Started
                  </span>
                }
                className="bg-white/10 backdrop-blur-sm border border-white/20"
                headStyle={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
              >
                <List
                  dataSource={[
                    "Improve my health and lung function",
                    "Save money for important things",
                    "Be a better role model for my family",
                    "Reduce risk of cancer and heart disease",
                    "Feel more confident and energetic",
                  ]}
                  renderItem={(item, index) => (
                    <List.Item className="border-none">
                      <div className="flex items-center text-white">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4 text-sm font-bold">
                          {index + 1}
                        </div>
                        {item}
                      </div>
                    </List.Item>
                  )}
                />
              </Card>

              {/* Community Support */}
              <Card
                title={
                  <span className="text-white flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Community Support
                  </span>
                }
                className="bg-white/10 backdrop-blur-sm border border-white/20"
                headStyle={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div className="text-center py-6">
                  <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Join Our Community
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Connect with others on the same journey and share your
                    experiences
                  </p>
                  <Button
                    type="primary"
                    size="large"
                    className="bg-gradient-to-r from-green-500 to-blue-500 border-none"
                  >
                    Join Community Forum
                  </Button>
                </div>
              </Card>
            </div>
          </TabPane>

          {/* Quit History Timeline Tab */}
          <TabPane
            tab={
              <span className="text-white">
                <Clock className="w-4 h-4 mr-2" />
                Timeline
              </span>
            }
            key="5"
          >
            <Card
              title={
                <span className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Your Quit Journey Timeline
                </span>
              }
              className="bg-white/10 backdrop-blur-sm border border-white/20"
              headStyle={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Timeline className="mt-6">
                {quitHistory.map((item, index) => (
                  <Timeline.Item
                    key={index}
                    color={
                      item.type === "success"
                        ? "green"
                        : item.type === "warning"
                        ? "orange"
                        : "red"
                    }
                    dot={
                      item.type === "success" ? (
                        <Trophy className="w-4 h-4 text-green-400" />
                      ) : item.type === "warning" ? (
                        <MessageCircle className="w-4 h-4 text-orange-400" />
                      ) : (
                        <Cigarette className="w-4 h-4 text-red-400" />
                      )
                    }
                  >
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold text-white">
                          {item.event}
                        </h4>
                        <span className="text-gray-400 text-sm">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </TabPane>
        </Tabs>

        {/* Journal Entry Modal */}
        <Modal
          title={editingEntry ? "Edit Journal Entry" : "Add Journal Entry"}
          open={isJournalModalVisible}
          onCancel={() => setIsJournalModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleJournalSubmit}
            initialValues={{
              date: dayjs(),
              cigarettes: 0,
              mood: 5,
              cravings: 0,
              exercise: 0,
              healthStatus: "good",
            }}
          >
            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
              <DatePicker className="w-full" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="cigarettes" label="Cigarettes Smoked">
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item name="cravings" label="Craving Intensity (1-10)">
                <Rate count={10} />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="mood" label="Mood (1-10)">
                <Rate count={10} />
              </Form.Item>

              <Form.Item name="exercise" label="Exercise (minutes)">
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </div>

            <Form.Item name="healthStatus" label="Health Status">
              <Select>
                <Select.Option value="excellent">Excellent</Select.Option>
                <Select.Option value="good">Good</Select.Option>
                <Select.Option value="fair">Fair</Select.Option>
                <Select.Option value="poor">Poor</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="notes" label="Notes & Reflections">
              <TextArea
                rows={4}
                placeholder="How are you feeling today? Any challenges or victories?"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setIsJournalModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingEntry ? "Update Entry" : "Add Entry"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>

      <style jsx>{`
        .custom-tabs .ant-tabs-nav {
          margin-bottom: 24px;
        }

        .custom-tabs .ant-tabs-tab {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-right: 8px;
          border-radius: 8px;
        }

        .custom-tabs .ant-tabs-tab-active {
          background: rgba(255, 255, 255, 0.2);
          border-color: #1890ff;
        }

        .custom-tabs .ant-tabs-tab:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .custom-tabs .ant-tabs-content-holder {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

export default Progress;
