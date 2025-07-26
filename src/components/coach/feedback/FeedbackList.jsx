import React from "react";
import { List, Empty, Typography } from "antd";
import FeedbackItem from "./FeedbackItem";

const { Title } = Typography;

const FeedbackList = ({ feedbacks, loading }) => {
  return (
    <div className="bg-white border shadow-sm rounded-2xl p-4">
      <Title level={4} className="mb-4">
        Danh sách đánh giá chi tiết
      </Title>

      {feedbacks.length === 0 ? (
        <Empty description="Chưa có đánh giá nào" className="py-8" />
      ) : (
        <List
          dataSource={feedbacks}
          itemLayout="horizontal"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đánh giá`,
          }}
          renderItem={(item) => <FeedbackItem item={item} />}
        />
      )}
    </div>
  );
};

export default FeedbackList;
