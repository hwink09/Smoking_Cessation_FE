import React from "react";
import { Spin } from "antd";

const LoadingSpinner = ({ message = "Đang tải dữ liệu..." }) => {
  return (
    <div className="flex justify-center items-center h-[300px]">
      <Spin size="large">
        <div className="pt-8">
          <p className="text-center text-gray-500">{message}</p>
        </div>
      </Spin>
    </div>
  );
};

export default LoadingSpinner;
