import { useEffect, useState } from "react";
import FeedbackTable from "../../components/admin/feedbackManagement/FeedbackTable";
import FeedbackStats from "../../components/admin/feedbackManagement/FeedbackStats";
import FeedbackFilter from "../../components/admin/feedbackManagement/FeedbackFilter";
import AdminLayout from "~/components/layouts/admin/AdminLayout";
import FeedbackService from "~/services/feedbackService"; // Import "sứ giả"
import { Spin, message, Alert } from "antd"; // Thêm các component UI

const admin = {
  name: "Admin Nguyễn",
  avatar: "https://i.pravatar.cc/150?img=3",
  role: "Super Admin",
};

export default function FeedbackManagement() {
  const [filter, setFilter] = useState("all");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dán đoạn code này vào file FeedbackManagement.jsx, thay thế cho các dòng xử lý logic cũ

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await FeedbackService.getAllFeedbacks();
        // Backend trả về { message, data }, chúng ta lấy data
        setFeedbacks(response.data || []);
      } catch (err) {
        setError("Không thể tải dữ liệu đánh giá từ server.");
        message.error("Đã có lỗi xảy ra!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []); // Mảng rỗng [] nghĩa là chỉ chạy 1 lần duy nhất

  // Logic lọc và tính toán bây giờ sẽ hoạt động trên dữ liệu thật
  const filteredFeedbacks = feedbacks.filter(
    (f) => filter === "all" || f.status === filter // Lọc theo status từ API
  );

  const avg =
    filteredFeedbacks.length > 0
      ? (
          filteredFeedbacks.reduce((sum, f) => sum + f.rating, 0) /
          filteredFeedbacks.length
        ).toFixed(1)
      : 0;

  const handleAction = (id, action) => {
    // Chúng ta sẽ hoàn thiện hàm này ở bước sau
    console.log(`Hành động: ${action} trên ID: ${id}`);
  };

  // Thêm phần hiển thị trạng thái loading và error
  if (loading) {
    return (
      <AdminLayout admin={admin}>
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout admin={admin}>
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout admin={admin}>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text">
          Quản lý đánh giá & phản hồi
        </h1>
        <FeedbackFilter value={filter} onChange={setFilter} />
      </div>
      <FeedbackStats average={avg} />
      <FeedbackTable data={filteredFeedbacks} onAction={handleAction} />
    </AdminLayout>
  );
}
