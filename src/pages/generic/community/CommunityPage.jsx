import React from "react";
import PostCard from "~/components/generic/community/PostCard";
import { communityPosts } from "~/components/generic/community/mockData";
import CreatePost from "~/components/generic/community/CreatePost";
import FilterTabs from "~/components/generic/community/FilterTabs";
import { Card, Avatar, List } from "antd";
import { Users, Hash } from "lucide-react";

// Dữ liệu giả cho sidebar
const trendingTopics = [
  "#motivation",
  "#day30",
  "#askForHelp",
  "#newbie",
  "#celebrate",
];
const suggestedFriends = [
  { name: "Coach Hùng", avatar: "https://i.pravatar.cc/150?img=3" },
  { name: "Vũ Thị Lan", avatar: "https://i.pravatar.cc/150?img=8" },
];

function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mb-2">
          Community Hub
        </h1>
        <p className="text-lg text-gray-300">
          Connect, Share, and Succeed Together
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột chính: Feed */}
        <div className="lg:col-span-2 space-y-6">
          <CreatePost />
          <FilterTabs />
          {communityPosts.map((postData) => (
            <PostCard key={postData.id} postData={postData} />
          ))}
        </div>

        {/* Cột phụ: Sidebar */}
        <div className="space-y-6">
          <Card
            title={
              <span className="text-white flex items-center">
                <Hash size={16} className="mr-2" />
                Trending Topics
              </span>
            }
            className="bg-white/10 backdrop-blur-sm border-white/20">
            {trendingTopics.map((topic) => (
              <p
                key={topic}
                className="text-blue-400 cursor-pointer hover:underline mb-1">
                {topic}
              </p>
            ))}
          </Card>

          <Card
            title={
              <span className="text-white flex items-center">
                <Users size={16} className="mr-2" />
                Suggested Friends
              </span>
            }
            className="bg-white/10 backdrop-blur-sm border-white/20">
            <List
              itemLayout="horizontal"
              dataSource={suggestedFriends}
              renderItem={(item) => (
                <List.Item className="!border-b-white/10">
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={
                      <a href="#" className="!text-white">
                        {item.name}
                      </a>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
