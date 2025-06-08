import { useState } from "react";
import FeedbackTable from "../../components/Admin/feedbackManagement/FeedbackTable";
import FeedbackStats from "../../components/Admin/feedbackManagement/FeedbackStats";
import FeedbackFilter from "../../components/Admin/feedbackManagement/FeedbackFilter";
import AdminLayout from "~/components/layouts/admin/AdminLayout";

const mockData = [
    {
        id: 1,
        user: "Nguyễn Văn A",
        feedback_type: "user_to_coach",
        target: "Coach B",
        rating: 4,
        content: "Tốt!",
        status: "pending",
    },
    // thêm dữ liệu mẫu
];

const admin = {
    name: "Admin Nguyễn",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "Super Admin",
};

export default function FeedbackManagement() {
    const [filter, setFilter] = useState("all");
    const [feedbacks, setFeedbacks] = useState(mockData);

    const filtered = feedbacks.filter((f) => filter === "all" || f.feedback_type === filter);

    const avg =
        filtered.length > 0
            ? (filtered.reduce((sum, f) => sum + f.rating, 0) / filtered.length).toFixed(1)
            : 0;

    const handleAction = (id, action) => {
        if (action === "delete") {
            setFeedbacks((prev) => prev.filter((f) => f.id !== id));
        } else {
            setFeedbacks((prev) =>
                prev.map((f) => (f.id === id ? { ...f, status: action } : f))
            );
        }
    };

    return (
        <AdminLayout admin={admin}>
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#6a5af9] to-[#1ecbe1] text-transparent bg-clip-text">Quản lý đánh giá & phản hồi</h1>
                <FeedbackFilter value={filter} onChange={setFilter} />
            </div>
            <FeedbackStats average={avg} />
            <FeedbackTable data={filtered} onAction={handleAction} />
        </AdminLayout>
    );
}
