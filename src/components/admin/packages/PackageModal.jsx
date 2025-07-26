import React, { useState, useEffect } from "react";
import { Modal, Input, Select, message } from "antd";

const PackageModal = ({
  open,
  onCancel,
  onOk,
  loading,
  isNew,
  editedPackage,
  setEditedPackage,
}) => {
  const [rawFeatureText, setRawFeatureText] = useState("");

  // Đồng bộ lại text mỗi khi mở modal hoặc editedPackage thay đổi
  useEffect(() => {
    if (open) {
      setRawFeatureText((editedPackage.features || []).join("\n"));
    }
    // eslint-disable-next-line
  }, [open]);

  const handleOk = () => {
    // Kiểm tra hợp lệ
    if (
      !editedPackage.name ||
      editedPackage.price === undefined ||
      editedPackage.price === "" ||
      editedPackage.duration_days === undefined ||
      editedPackage.duration_days === ""
    ) {
      message.error("Tên gói, giá và thời hạn là bắt buộc.");
      return;
    }
    if (isNaN(Number(editedPackage.price)) || Number(editedPackage.price) < 0) {
      message.error("Giá phải là số không âm.");
      return;
    }
    if (
      isNaN(Number(editedPackage.duration_days)) ||
      Number(editedPackage.duration_days) < 0
    ) {
      message.error("Thời hạn phải là số không âm.");
      return;
    }
    onOk(editedPackage);
  };

  return (
    <Modal
      open={open}
      title={isNew ? "Thêm gói mới" : "Chỉnh sửa gói"}
      onCancel={onCancel}
      onOk={handleOk}
      okText={isNew ? "Thêm" : "Lưu"}
      confirmLoading={loading}
      destroyOnHidden
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Select
          placeholder="Chọn tên gói"
          value={editedPackage.name}
          onChange={(value) =>
            setEditedPackage({ ...editedPackage, name: value })
          }
          disabled={!isNew}
        >
          <Select.Option value="free">free</Select.Option>
          <Select.Option value="plus">plus</Select.Option>
          <Select.Option value="premium">premium</Select.Option>
        </Select>
        {editedPackage.name && (
          <div style={{ marginTop: 8 }}>
            <span
              style={{
                border: `2px solid ${
                  editedPackage.name === "free"
                    ? "#52c41a"
                    : editedPackage.name === "plus"
                    ? "#1890ff"
                    : editedPackage.name === "premium"
                    ? "#faad14"
                    : "#d9d9d9"
                }`,
                color:
                  editedPackage.name === "free"
                    ? "#52c41a"
                    : editedPackage.name === "plus"
                    ? "#1890ff"
                    : editedPackage.name === "premium"
                    ? "#faad14"
                    : "#d9d9d9",
                padding: "2px 12px",
                borderRadius: 8,
                fontWeight: 600,
                textTransform: "capitalize",
                background: "#fff",
              }}
            >
              {editedPackage.name}
            </span>
          </div>
        )}

        <Input.TextArea
          placeholder="Mô tả"
          value={editedPackage.description}
          onChange={(e) =>
            setEditedPackage({
              ...editedPackage,
              description: e.target.value,
            })
          }
        />

        <Input.TextArea
          placeholder="Nhập mỗi tính năng trên một dòng"
          value={rawFeatureText}
          autoSize={{ minRows: 3 }}
          onChange={(e) => {
            setRawFeatureText(e.target.value);
            setEditedPackage({
              ...editedPackage,
              features: e.target.value
                .split(/\r?\n/)
                .map((f) => f.trim())
                .filter((f) => f),
            });
          }}
        />

        {/* <div style={{ marginTop: 16 }}>
          <b>Kết quả tách dòng:</b>
          <ul>
            {rawFeatureText
              .split(/\r?\n/)
              .map((f) => f.trim())
              .filter((f) => f)
              .map((f, i) => (
                <li key={i}>{f}</li>
              ))}
          </ul>
        </div> */}

        <Input
          type="number"
          placeholder="Giá"
          value={editedPackage.price}
          min={0}
          onChange={(e) =>
            setEditedPackage({ ...editedPackage, price: e.target.value })
          }
        />

        <Input
          type="number"
          placeholder="Thời hạn (ngày)"
          value={editedPackage.duration_days}
          min={0}
          onChange={(e) =>
            setEditedPackage({
              ...editedPackage,
              duration_days: e.target.value,
            })
          }
        />
      </div>
    </Modal>
  );
};

export default PackageModal;
