import React, { useState } from "react";
import { Button, Tabs, Form, message } from "antd";
import {
  PlusOutlined,
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
  CalendarOutlined,
  DollarOutlined,
  HeartOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { BookOpen, Star, Clock } from "lucide-react";
import dayjs from "dayjs";

// Import các component con đã tách
import ProgressHeader from "./ProgressHeader";
import OverviewCards from "./OverviewCards";
import AnnualProgressBar from "./AnnualProgressBar";
import JournalTab from "./JournalTab";
import MotivationTab from "./MotivationTab";
import TimelineTab from "./TimelineTab";
import TabHeader from "./TabHeader";
import JournalModal from "./JournalModal";

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
      icon: CalendarOutlined, // truyền component class
      bgColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
      textColor: "text-emerald-400",
      emoji: "✅",
    },
    {
      title: "Money Saved",
      value: formatMoney(stats.moneySaved),
      unit: "",
      icon: DollarOutlined,
      bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
      textColor: "text-blue-400",
      emoji: "💰",
    },
    {
      title: "Health Progress",
      value: stats.healthImprovement,
      unit: "%",
      icon: HeartOutlined,
      bgColor: "bg-gradient-to-br from-pink-500 to-rose-600",
      textColor: "text-pink-400",
      emoji: "❤️",
    },
    {
      title: "Badges Earned",
      value: stats.badgesEarned,
      unit: "badges",
      icon: CrownOutlined,
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
    <div className="min-h-screen p-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ProgressHeader quitDate={quitDate} />

        {/* Progress Overview Cards */}
        <OverviewCards overviewCards={overviewCards} />

        {/* Overall Progress Bar */}
        <AnnualProgressBar
          stats={stats}
          handleShareProgress={handleShareProgress}
        />

        {/* Main Content Tabs */}
        <Tabs defaultActiveKey="1" type="card" className="achievements-tabs">
          {/* Daily Journal Tab */}
          <TabPane
            tab={
              <TabHeader
                icon={<BookOpen className="w-5 h-5" />}
                label="Daily Journal"
              />
            }
            key="1"
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
            <JournalTab
              journalEntries={journalEntries}
              handleAddJournalEntry={handleAddJournalEntry}
              handleEditJournalEntry={handleEditJournalEntry}
              handleDeleteJournalEntry={handleDeleteJournalEntry}
              getMoodIcon={getMoodIcon}
              getHealthStatusColor={getHealthStatusColor}
            />
          </TabPane>

          {/* Motivational Reminders Tab */}
          <TabPane
            tab={
              <TabHeader
                icon={<Star className="w-5 h-5" />}
                label="Motivational Reminders"
              />
            }
            key="2"
          >
            <MotivationTab motivationalMessages={motivationalMessages} />
          </TabPane>

          {/* Quit History Timeline Tab */}
          <TabPane
            tab={
              <TabHeader
                icon={<Clock className="w-5 h-5" />}
                label="Timeline"
              />
            }
            key="3"
          >
            <TimelineTab quitHistory={quitHistory} />
          </TabPane>
        </Tabs>

        {/* Journal Entry Modal */}
        <JournalModal
          isJournalModalVisible={isJournalModalVisible}
          setIsJournalModalVisible={setIsJournalModalVisible}
          form={form}
          editingEntry={editingEntry}
          handleJournalSubmit={handleJournalSubmit}
        />
      </div>
    </div>
  );
}

export default Progress;
