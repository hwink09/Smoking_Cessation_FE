import React from "react";
import { Avatar, Rate, List } from "antd";
import { UserOutlined } from "@ant-design/icons";

const FeedbackItem = ({ item }) => {
  const getUserName = () => {
    return item.user_id?.name || item.user?.name || "Người dùng";
  };

  const getUserAvatar = () => {
    return item.user_id?.avatar_url || item.user?.avatar_url;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <List.Item className="border-b border-gray-100 last:border-b-0 py-4">
      <List.Item.Meta
        avatar={
          <Avatar src={getUserAvatar()} icon={<UserOutlined />} size={48} />
        }
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">{getUserName()}</span>
              <div className="flex items-center gap-1">
                <Rate disabled value={item.rating} size="small" />
                <span className="text-sm text-gray-600">({item.rating}/5)</span>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(item.createdAt)}
            </span>
          </div>
        }
        description={
          <div className="mt-2">
            <p className="text-gray-700 leading-relaxed">{item.content}</p>
          </div>
        }
      />
    </List.Item>
  );
};

export default FeedbackItem;
