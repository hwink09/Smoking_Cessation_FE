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
    deleteSmokingStatus 
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

    const recordData = {
      frequency: values.frequency,
      cigarettes_per_day: values.cigarettes_per_day,
      cost_per_pack: values.cost_per_pack,
      start_date: values.start_date.format("YYYY-MM-DD"),
    };

    try {
      if (editingRecord) {
        await updateSmokingStatus(userId, recordData);
        message.success("Record updated successfully!");
      } else {
        await createSmokingStatus(userId, recordData);
        message.success("Record added successfully!");
      }
      await fetchSmokingStatus(userId);
      handleCloseModal();
    } catch (err) {
      message.error(`Operation failed: ${err.message}`);
    }
  };


  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await deleteSmokingStatus(userId);
      message.success("Record deleted successfully!");
      await fetchSmokingStatus(userId);
    } catch (err) {
      message.error(`Delete failed: ${err.message}`);
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
  }, [userId]);

  return (
    <div style={{ padding: "24px" }}>
      <SmokingHeader onAddClick={() => setIsModalVisible(true)} />
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
  );
}
