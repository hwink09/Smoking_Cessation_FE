import React from "react";
import {
  Table,
  Button,
  Spin,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import usePackages from "~/hooks/usePackages";
import PackageModal from "./PackageModal"; // 👈 import Modal

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
    handleDelete,
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
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => openEditModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xoá?"
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger type="link" icon={<DeleteOutlined />}>
              Xoá
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 40 }}>
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
