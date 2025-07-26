import React from "react";
import { Spin } from "antd";

const QuitPlanLoadingState = () => {
  return (
    <div className="flex justify-center items-center h-[300px]">
      <Spin size="large">
        <div className="pt-8">
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </Spin>
    </div>
  );
};

export default QuitPlanLoadingState;
