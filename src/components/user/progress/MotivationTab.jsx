import React from "react";
import { Card, Button, List } from "antd";
import { Star, Heart, Users } from "lucide-react";

function MotivationTab({ motivationalMessages }) {
  return (
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
            Connect with others on the same journey and share your experiences
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
  );
}

export default MotivationTab;
