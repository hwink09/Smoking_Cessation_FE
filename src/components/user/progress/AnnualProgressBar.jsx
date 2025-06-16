import React from "react";
import { Card, Button, Progress as AntProgress } from "antd";
import { Target, Share2 } from "lucide-react";

function AnnualProgressBar({ stats, handleShareProgress }) {
  return (
    <Card className="mb-8 bg-white/10 backdrop-blur-sm border border-white/20">
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
  );
}

export default AnnualProgressBar;
