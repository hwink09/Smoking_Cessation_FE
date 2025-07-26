import { useState, useEffect } from "react";
import { message } from "antd";

import { useAuth } from "~/hooks/useAuth";
import useSmokingStatus from "~/hooks/useSmokingStatus";
import SmokingHeader from "~/components/user/smokingstatus/SmokingHeader";
import SmokingTable from "~/components/user/smokingstatus/SmokingTable";
import SmokingModal from "~/components/user/smokingstatus/SmokingModal";
import ColourfulText from "~/components/ui/colourful-text";

export default function SmokingStatusPage() {
  const {
    statusData,
    fetchSmokingStatus,
    createSmokingStatus,
    updateSmokingStatus,
    deleteSmokingStatus,
  } = useSmokingStatus();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const { currentUser: user } = useAuth();
  const userId = user?.userId;

  const handleSubmit = async (values) => {
    if (!userId) {
      message.error("Thông tin người dùng chưa sẵn sàng. Vui lòng thử lại.");
      return;
    }

    if (!values.cigarettes_per_day || !values.cost_per_pack) {
      message.error("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    const recordData = {
      cigarettes_per_day: Number(values.cigarettes_per_day),
      cost_per_pack: Number(values.cost_per_pack),
      frequency: values.frequency || "daily",
    };

    try {
      if (editingRecord) {
        await updateSmokingStatus(userId, recordData);
      } else {
        await createSmokingStatus(userId, recordData);
      }
      await fetchSmokingStatus(userId);
      handleCloseModal();
    } catch (err) {
      console.error("Đã xảy ra lỗi:", err);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await deleteSmokingStatus(userId);
      await fetchSmokingStatus(userId);
    } catch (err) {
      console.error("Lỗi khi xoá:", err);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  useEffect(() => {
    if (userId) {
      fetchSmokingStatus(userId);
    }
  }, [userId, fetchSmokingStatus]);

  const isLoading = !userId;
  const hasData = Array.isArray(statusData)
    ? statusData.length > 0
    : !!statusData;

  const processedRecords = Array.isArray(statusData)
    ? statusData.map((r) => ({ ...r, id: r._id }))
    : statusData
    ? [{ ...statusData, id: statusData._id }]
    : [];

  return (
    <div className="min-h-screen text-slate-800 p-4 max-w-6xl mx-auto">
      {isLoading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      ) : (
        <>
          <div className="text-center mb-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8 rounded-2xl shadow-md border border-blue-200">
            <div className="relative mb-10">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200 inline-block">
                Tình trạng <ColourfulText text="hút thuốc" />
              </h1>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Theo dõi thói quen hút thuốc để có kế hoạch bỏ thuốc hiệu quả!
              </p>
            </div>

            <SmokingHeader
              onAddClick={() => setIsModalVisible(true)}
              hasData={hasData}
            />
          </div>

          <SmokingTable
            records={processedRecords}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <SmokingModal
            visible={isModalVisible}
            editingRecord={editingRecord}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
          />
        </>
      )}
    </div>
  );
}
