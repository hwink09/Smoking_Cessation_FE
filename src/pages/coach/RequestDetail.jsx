import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const RequestDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const request = location.state?.request;

  if (!request) {
    return (
      <div className="text-center mt-10 text-red-500">
        Không có dữ liệu yêu cầu.
      </div>
    );
  }

  const handleCreatePlan = () => {
    navigate("/coach/create-quit-plan", {
      state: { data: request },
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 mt-10 shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Chi tiết Yêu cầu Kế hoạch
      </h2>

      <div className="space-y-3 text-gray-700">
        <p>
          <strong>Người dùng:</strong> {request.user_id?.name} (
          {request.user_id?.email})
        </p>
        <p>
          <strong>Lý do:</strong> {request.reason}
        </p>
        <p>
          <strong>Tên kế hoạch:</strong> {request.name}
        </p>
        <p>
          <strong>Ngày bắt đầu:</strong>{" "}
          {dayjs(request.start_date).format("DD/MM/YYYY")}
        </p>
        <p>
          <strong>Ngày mục tiêu:</strong>{" "}
          {dayjs(request.target_quit_date).format("DD/MM/YYYY")}
        </p>
        <p>
          <strong>Trạng thái:</strong>{" "}
          <span className="text-blue-600">{request.status}</span>
        </p>
      </div>

      <button
        onClick={handleCreatePlan}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Tạo kế hoạch từ yêu cầu này
      </button>
    </div>
  );
};

export default RequestDetail;
