import React from "react";
import { Card, Timeline } from "antd";
import { Activity, Trophy, MessageCircle, Cigarette } from "lucide-react";

function TimelineTab({ quitHistory }) {
  return (
    <Card
      title={
        <span className="text-white flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Your Quit Journey Timeline
        </span>
      }
      className="bg-white/10 backdrop-blur-sm border border-white/20"
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
                <span className="text-gray-400 text-sm">{item.date}</span>
              </div>
              <p className="text-gray-300">{item.description}</p>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );
}

export default TimelineTab;
