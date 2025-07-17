import React, { useEffect, useState } from "react";
import {
  Table,
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
} from "antd";
import { UserOutlined } from "@ant-design/icons";

import dayjs from "dayjs";
import api from "~/services/api";

const { Option } = Select;
const { Title } = Typography;

const CoachNotification = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notifications/my-students-progress");
      setData(res.data || []);
    } catch (err) {
      message.error("Lỗi khi lấy dữ liệu học viên", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendNotification = (record) => {
    setSelectedProgress(record);
    form.setFieldsValue({
      type: record.progress ? "motivation" : "reminder",
    });
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        message: values.message,
        type: values.type,
      };

     if (
  selectedProgress.progress &&
  typeof selectedProgress.progress === "object" &&
  selectedProgress.progress._id
) {
  payload.progress_id = selectedProgress.progress._id;
} else {
  payload.user_id = selectedProgress.user._id;
}

      await api.post("/notifications", payload);
      message.success("Gửi thông báo thành công");
      setModalVisible(false);
      form.resetFields();
      await fetchData(); // cập nhật lại bảng sau khi gửi
    } catch (err) {
      message.error("Lỗi khi gửi thông báo", err);
    }
  };

  const columns = [
    {
      title: "Học viên",
      dataIndex: ["user", "name"],
      key: "name",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Avatar",
      dataIndex: ["user", "avatar_url"],
      key: "avatar",
      render: (avatar) => (
        <Avatar src={avatar} icon={!avatar && <UserOutlined />} />
      ),
    },
    {
      title: "Tên kế hoạch",
      dataIndex: ["quit_plan", "name"],
      key: "plan_name",
    },
    {
      title: "Stage",
      dataIndex: ["stage", "title"],
      key: "stage",
    },
    {
      title: "Ngày tiến trình",
      dataIndex: ["progress", "date"],
      key: "progress_date",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "Chưa có"),
    },
    {
      title: "Số điếu",
      dataIndex: ["progress", "cigarettes_smoked"],
      key: "cigs",
      render: (val) => (val !== undefined ? val : "-"),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Button type='primary' onClick={() => handleSendNotification(record)}>
          {record.progress ? "Gửi động viên" : "Nhắc nhở"}
        </Button>
      ),
    },
    {
      title: "Thông báo đã gửi",
      key: "notifications",
      render: (_, record) => {
        const notifications = record.notifications || [];

        if (notifications.length === 0) return "Chưa có";

        return notifications.map((noti) => (
          <div key={noti._id} className='mb-2'>
            <span className='font-semibold'>
              {noti.type === "reminder" ? "🕑 Nhắc" : "💪 Động viên"}:
            </span>{" "}
            <span>{noti.message}</span> <br />
            <span className='text-xs text-gray-400'>
              {dayjs(noti.schedule).format("DD/MM/YYYY HH:mm")}
            </span>
          </div>
        ));
      },
    },
  ];

  return (
    <section className='p-10 bg-white min-h-screen text-black'>
      <Title level={2} style={{ textAlign: "center" }}>
        Gửi Thông Báo Cho Học Viên
      </Title>

      <div className='mt-6 bg-white rounded-xl shadow p-6 max-w-7xl mx-auto'>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => `${record.user._id}-${record.stage._id}`}
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        title='Gửi Thông Báo'
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText='Gửi'
        cancelText='Huỷ'>
        <Form form={form} layout='vertical'>
          <Form.Item
            name='message'
            label='Nội dung'
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}>
            <Input.TextArea rows={4} placeholder='Nhập nội dung...' />
          </Form.Item>

          <Form.Item
            name='type'
            label='Loại thông báo'
            rules={[{ required: true, message: "Chọn loại thông báo" }]}>
            <Select placeholder='Chọn loại'>
              <Option value='reminder'>Nhắc nhở</Option>
              <Option value='motivation'>Động viên</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default CoachNotification;
