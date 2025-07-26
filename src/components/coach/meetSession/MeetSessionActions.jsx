import React from "react";
import { Button, Space } from "antd";

const MeetSessionActions = ({ record, onStatusUpdate, onComplete }) => {
  const actions = [];

  if (record.status === "pending") {
    actions.push(
      <Button
        type="primary"
        size="small"
        onClick={() => onStatusUpdate(record, "accepted")}
        key="accept"
      >
        Chấp nhận
      </Button>
    );
    actions.push(
      <Button
        danger
        size="small"
        onClick={() => onStatusUpdate(record, "rejected")}
        key="reject"
      >
        Từ chối
      </Button>
    );
  }

  if (record.status === "accepted") {
    actions.push(
      <Button
        size="small"
        type="dashed"
        onClick={() => onComplete(record._id, "completed")}
        key="complete"
      >
        Hoàn tất
      </Button>
    );
  }

  return <Space>{actions}</Space>;
};

export default MeetSessionActions;
