import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const PageHeader = () => {
  return (
    <div className="text-center mb-6">
      <Title
        level={2}
        className="!m-0 text-gray-800 flex justify-center items-center"
      >
        Danh sách yêu cầu kế hoạch
      </Title>
    </div>
  );
};

export default PageHeader;
