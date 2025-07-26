import React from "react";
import { Button, Popconfirm } from "antd";

const ActionButtons = ({ record, onApprove, onReject, onCreatePlan }) => {
  const { status, _id } = record;

  if (status === "pending") {
    return (
      <div className="flex gap-2">
        <Button type="primary" size="small" onClick={() => onApprove(_id)}>
          Duyệt
        </Button>
        <Popconfirm
          title="Bạn có chắc muốn từ chối yêu cầu này?"
          onConfirm={() => onReject(_id)}
          okText="Từ chối"
          cancelText="Hủy"
        >
          <Button danger size="small">
            Từ chối
          </Button>
        </Popconfirm>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <Button type="primary" size="small" onClick={() => onCreatePlan(record)}>
        Tạo kế hoạch
      </Button>
    );
  }

  if (status === "created") {
    return <span className="text-green-600 font-medium">Đã tạo kế hoạch</span>;
  }

  return <span>-</span>;
};

export default ActionButtons;
