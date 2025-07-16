import React, { useEffect, useState } from "react";
import { Table, Avatar, Typography, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import QuitPlanService from "~/services/quitPlanService";

const { Title } = Typography;

const CoachQuitPlanTable = () => {
  const [quitPlans, setQuitPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuitPlans = async () => {
      setLoading(true);
      try {
        const response = await QuitPlanService.coach.getMyUsers();
        const plansWithKeys = (response || []).map((plan, index) => ({
          ...plan,
          key: plan._id || `plan-${index}`,
        }));
        setQuitPlans(plansWithKeys);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách kế hoạch:", err);
        message.error("Không thể lấy dữ liệu kế hoạch bỏ thuốc");
      } finally {
        setLoading(false);
      }
    };

    fetchQuitPlans();
  }, []);

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (name) => name || "Không có",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => email || "Không có",
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <Avatar
          src={avatar}
          icon={!avatar && <UserOutlined />}
          style={{ backgroundColor: avatar ? undefined : "#87d068" }}
        />
      ),
    },
    {
      title: "Tên kế hoạch",
      dataIndex: "plan_name",
      key: "plan_name",
      render: (name) => name || "Không có",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày dự kiến bỏ thuốc",
      dataIndex: "target_quit_date",
      key: "target_quit_date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
  ];

  return (
    <section className="p-10 bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
      <Title level={2} style={{ textAlign: "center", color: "#fff" }}>
        Các kế hoạch bỏ thuốc được giao cho bạn
      </Title>

      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <Table
          columns={columns}
          dataSource={quitPlans}
          rowKey="key"
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </section>
  );
};

export default CoachQuitPlanTable;
