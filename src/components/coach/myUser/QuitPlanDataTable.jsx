import React from "react";
import { Table, Typography, Empty } from "antd";
import getQuitPlanColumns from "./QuitPlanTableColumns";

const { Title } = Typography;

const QuitPlanDataTable = ({ quitPlans, loading }) => {
  const columns = getQuitPlanColumns();

  return (
    <div className="bg-white border shadow-sm rounded-2xl p-4">
      <Title level={4} className="mb-4">
        Danh sách kế hoạch chi tiết
      </Title>

      {quitPlans.length === 0 ? (
        <Empty description="Chưa có kế hoạch bỏ thuốc nào" className="py-8" />
      ) : (
        <Table
          columns={columns}
          dataSource={quitPlans}
          rowKey="key"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} kế hoạch`,
          }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      )}
    </div>
  );
};

export default QuitPlanDataTable;
