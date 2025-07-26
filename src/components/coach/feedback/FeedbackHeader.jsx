import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const FeedbackHeader = ({ title = "Đánh giá từ học viên" }) => {
  return (
    <div className="text-center mb-6">
      <Title
        level={2}
        className="!m-0 text-gray-800 flex justify-center items-center"
      >
        {title}
      </Title>
    </div>
  );
};

export default FeedbackHeader;
