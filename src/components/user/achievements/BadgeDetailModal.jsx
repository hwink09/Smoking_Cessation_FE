import React from "react";
import { Modal, Button, Progress } from "antd";
import { BadgeCheck, Share2 } from "lucide-react";

const BadgeDetailModal = ({ badge, visible, onClose, onShare }) => {
  const tierColors = {
    Bronze: "bg-yellow-700 text-white",
    Silver: "bg-zinc-400 text-black",
    Gold: "bg-yellow-400 text-black",
    Platinum: "bg-blue-500 text-white",
    Diamond: "bg-teal-400 text-black",
  };

  if (!badge) return null;

  return (
    <Modal
      title={
        <div className="flex items-center">
          <span className="text-2xl mr-2">{badge.icon}</span>
          <span>{badge.name}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        badge?.earned && (
          <Button
            key="share"
            type="primary"
            icon={<Share2 className="w-4 h-4" />}
            onClick={() => onShare(badge)}
          >
            Share
          </Button>
        ),
      ]}
    >
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

        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
            tierColors[badge.tier]
          }`}
        >
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
            <p className="text-gray-500 mb-2">
              Progress: {badge.progress || 0}%
            </p>
            <Progress
              percent={badge.progress || 0}
              status="active"
              strokeColor={badge.color}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default BadgeDetailModal;
