import { useState, useEffect } from "react";
import { message } from "antd";

import { useAuth } from "~/hooks/useAuth";
import useSmokingStatus from "~/hooks/useSmokingStatus";
import SmokingHeader from "~/components/user/smokingstatus/SmokingHeader";
import SmokingTable from "~/components/user/smokingstatus/SmokingTable";
import SmokingModal from "~/components/user/smokingstatus/SmokingModal";

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
      message.error("User information not loaded yet. Please try again.");
      return;
    }

    // Validate values
    if (!values.cigarettes_per_day || !values.cost_per_pack) {
      message.error("Please fill in all required fields.");
      return;
    }

    const recordData = {
      cigarettes_per_day: Number(values.cigarettes_per_day),
      cost_per_pack: Number(values.cost_per_pack),
      frequency: values.frequency || "daily", // Include frequency field
    };

    console.log("Sending data:", recordData);

    try {
      if (editingRecord) {
        await updateSmokingStatus(userId, recordData);
      } else {
        await createSmokingStatus(userId, recordData);
      }
      await fetchSmokingStatus(userId);
      handleCloseModal();
    } catch (err) {
      console.error("Error details:", err);
      // Error messages are already handled in the hook
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
    } catch {
      // Error messages are already handled in the hook
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

  return (
    <div
      style={{
        padding: "24px",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <SmokingHeader
          onAddClick={() => setIsModalVisible(true)}
          hasData={
            statusData &&
            (Array.isArray(statusData) ? statusData.length > 0 : true)
          }
        />
        <SmokingTable
          records={
            Array.isArray(statusData)
              ? statusData.map((r) => ({ ...r, id: r._id }))
              : statusData
              ? [{ ...statusData, id: statusData._id }]
              : []
          }
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <SmokingModal
          visible={isModalVisible}
          editingRecord={editingRecord}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </div>

      {/* Custom CSS for enhanced animations */}
      <style>{`
        .ant-table-tbody > tr:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.3s ease !important;
        }

        .ant-card {
          transition: all 0.3s ease !important;
        }

        .ant-card:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }

        .ant-btn {
          transition: all 0.3s ease !important;
        }

        .ant-modal-content {
          border-radius: 16px !important;
          overflow: hidden !important;
        }

        .ant-modal-header {
          border-radius: 16px 16px 0 0 !important;
        }

        .ant-form-item-label > label {
          font-weight: 600 !important;
        }

        .ant-input-number,
        .ant-picker {
          border-radius: 8px !important;
        }

        .ant-statistic-title {
          font-size: 14px !important;
        }

        .ant-statistic-content-value {
          font-size: 24px !important;
        }

        /* Responsive improvements */
        @media (max-width: 768px) {
          .ant-table-scroll {
            overflow-x: auto !important;
          }

          .ant-statistic-content-value {
            font-size: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
