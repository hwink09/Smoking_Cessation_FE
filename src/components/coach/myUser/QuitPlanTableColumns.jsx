import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const getQuitPlanColumns = () => {
  return [
    {
      title: "Người dùng",
      dataIndex: "user",
      key: "user",
      width: 200,
      fixed: "left",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Avatar
            src={record.avatar}
            icon={!record.avatar && <UserOutlined />}
            size={32}
          />
          <div>
            <div className="font-medium">{record.name || "Không có tên"}</div>
            <div className="text-gray-500 text-sm">
              {record.email || "Không có email"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Tên kế hoạch",
      dataIndex: "plan_name",
      key: "plan_name",
      width: 200,
      render: (name) => (
        <div className="font-medium text-blue-600">
          {name || "Không có tên kế hoạch"}
        </div>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      width: 130,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a, b) => dayjs(a.start_date).unix() - dayjs(b.start_date).unix(),
    },
    {
      title: "Ngày dự kiến bỏ thuốc",
      dataIndex: "target_quit_date",
      key: "target_quit_date",
      width: 170,
      render: (date) => (
        <div className="text-green-600 font-medium">
          {dayjs(date).format("DD/MM/YYYY")}
        </div>
      ),
      sorter: (a, b) =>
        dayjs(a.target_quit_date).unix() - dayjs(b.target_quit_date).unix(),
    },
  ];
};

export default getQuitPlanColumns;
