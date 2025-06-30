import React, { useEffect, useState } from "react";
import { Table, Avatar, Typography, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import api from "~/services/api";

const { Title } = Typography;

const CoachQuitPlan = () => {
  const [quitPlans, setQuitPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuitPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get("/quitPlan/my-users");
      setQuitPlans(response.data || []);
    } catch (err) {
      console.error("Failed to fetch quit plans:", err);
      message.error("Failed to fetch quit plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuitPlans();
  }, []);

  const columns = [
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email User",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <Avatar
          src={avatar}
          icon={!avatar ? <UserOutlined /> : null}
          style={{ backgroundColor: "#87d068" }}
        />
      ),
    },

    {
      title: "Plan Name",
      dataIndex: "plan_name",
      key: "plan_name",
    },

    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Target Quit Date",
      dataIndex: "target_quit_date",
      key: "target_quit_date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <section className="p-10 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
      <Title level={2} style={{ textAlign: "center", color: "#fff" }}>
        Quit Plans Assigned to You
      </Title>

      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <Table
          columns={columns}
          dataSource={quitPlans}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </section>
  );
};

export default CoachQuitPlan;
