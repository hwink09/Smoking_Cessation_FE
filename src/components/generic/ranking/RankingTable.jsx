import React from "react";
import { Avatar, Table } from "antd";
import { Trophy } from "lucide-react";

const RankingTable = ({ title, data, valueFormatter }) => {
  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      render: (text, record) => (
        <span className="font-bold text-lg flex items-center">
          {record.rank <= 3 && (
            <Trophy
              size={20}
              className={
                record.rank === 1
                  ? "text-yellow-400"
                  : record.rank === 2
                  ? "text-gray-300"
                  : "text-yellow-600"
              }
            />
          )}
          <span className="ml-2">{text}</span>
        </span>
      ),
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user) => (
        <div className="flex items-center">
          <Avatar src={user.avatar} />
          <span className="ml-3 font-semibold">{user.name}</span>
        </div>
      ),
    },
    {
      title: "Achievement",
      dataIndex: "value",
      key: "value",
      render: (value, record) => (
        <span className="font-bold text-blue-400">
          {valueFormatter(value)} {record.unit}
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="rank"
      />
    </div>
  );
};

export default RankingTable;
