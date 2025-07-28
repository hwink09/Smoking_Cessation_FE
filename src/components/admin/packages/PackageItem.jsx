import React from "react";
import {
  Table,
  Button,
  Spin,
  Popconfirm,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import PackageModal from "./PackageModal";
import usePackages from "~/hooks/usePackages";
import ColourfulText from "~/components/ui/colourful-text";

const PackageItem = () => {
  const {
    packages,
    loading,
    selectedPackage,
    setSelectedPackage,
    editedPackage,
    setEditedPackage,
    isNew,
    setIsNew,
    openNewModal,
    openEditModal,
    handleSaveChanges,
    handleToggleActive,
  } = usePackages();

  const columns = [
    {
      title: "Tên gói",
      dataIndex: "name",
      key: "name",
      render: (name) => {
        let color = "#d9d9d9"; // default
        if (name === "free") color = "#52c41a";      // xanh lá
        if (name === "plus") color = "#1890ff";      // xanh dương
        if (name === "premium") color = "#faad14";   // vàng cam
        return (
          <span style={{
            border: `2px solid ${color}`,
            color: color,
            padding: "2px 12px",
            borderRadius: 8,
            fontWeight: 600,
            textTransform: "capitalize",
            background: "#fff"
          }}>
            {name}
          </span>
        );
      }
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} ₫`,
    },
    {
      title: "Thời hạn (ngày)",
      dataIndex: "duration_days",
      key: "duration_days",
    },
    {
      title: "Tính năng",
      dataIndex: "features",
      key: "features",
      render: (features) =>
        features && features.length > 0
          ? features.map((f, idx) => (
              <span key={idx} style={{ marginRight: 4, background: "#f0f0f0", padding: "2px 6px", borderRadius: 4 }}>
                {f}
              </span>
            ))
          : <span style={{ color: "#aaa" }}>Không có</span>,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => openEditModal(record)}
          >
            Sửa
          </Button>
          <Switch
            checked={record.is_active}
            checkedChildren="Đang bật"
            unCheckedChildren="Đang tắt"
            onChange={() => handleToggleActive(record)}
            style={{ minWidth: 70 }}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 40 }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: "black" }}>
          Quản lý <ColourfulText text="Gói" />
        </h2>
        <p style={{ color: "#666", fontSize: 18 }}>
          Xem xét và quản lý gói của người dùng nền tảng
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openNewModal}
        >
          Thêm gói mới
        </Button>
      </div>

      <div style={{ background: "#fff", padding: 24, borderRadius: 12 }}>
        {loading && packages.length === 0 ? (
          <Spin tip="Đang tải gói..." />
        ) : (
          <Table
            dataSource={packages}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: "Chưa có gói nào." }}
          />
        )}
      </div>

      <PackageModal
        open={!!selectedPackage || isNew}
        onCancel={() => {
          setSelectedPackage(null);
          setIsNew(false);
        }}
        onOk={(newPackage) => {
          setEditedPackage(newPackage);
          handleSaveChanges(newPackage);
        }}
        loading={loading}
        isNew={isNew}
        editedPackage={editedPackage}
        setEditedPackage={setEditedPackage}
      />
    </div>
  );
};

export default PackageItem;
