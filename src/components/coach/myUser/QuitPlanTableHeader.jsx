import React from "react";
import { Typography } from "antd";
import { TeamOutlined } from "@ant-design/icons";

const { Title } = Typography;

const QuitPlanTableHeader = () => {
  return (
    <div className="text-center mb-6">
      <Title
        level={2}
        className="!m-0 text-gray-800 flex justify-center items-center"
      >
        <TeamOutlined className="mr-2" />
        Các kế hoạch bỏ thuốc được giao cho bạn
      </Title>
    </div>
  );
};

export default QuitPlanTableHeader;
