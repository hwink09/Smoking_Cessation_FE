import { useState, useEffect, useCallback } from "react";
import PackageService from "~/services/packageService";
import { message } from "antd";

const usePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [editedPackage, setEditedPackage] = useState({
    name: "",
    description: "",
    price: "",
    duration_days: "",
    features: [],
  });
  const [isNew, setIsNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  // Fetch all packages
  const fetchPackages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PackageService.getAllPackages();
      setPackages(data);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải gói dịch vụ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Open edit modal
  const openEditModal = (pkg) => {
    setIsNew(false);
    setSelectedPackage(pkg);
    const features = Array.isArray(pkg.features)
      ? pkg.features
      : (typeof pkg.features === "string" && pkg.features
          ? pkg.features.split(/[,\r?\n]+/).map(f => f.trim()).filter(f => f)
          : []);
    console.log("features from pkg:", pkg.features, "=>", features);
    setEditedPackage({
      name: pkg.name || "",
      description: pkg.description || "",
      price: pkg.price || "",
      duration_days: pkg.duration_days || "",
      features,
    });
  };

  // Open create modal
  const openNewModal = () => {
    setIsNew(true);
    setSelectedPackage(null);
    setEditedPackage({
      name: "",
      description: "",
      price: "",
      duration_days: "",
      features: [],
    });
  };

  // Save (create or update)
  const handleSaveChanges = async () => {
    if (!editedPackage.name || !editedPackage.price) {
      message.warning("Vui lòng nhập đầy đủ tên và giá.");
      return;
    }

    setLoading(true);
    try {
      let features = editedPackage.features;
      if (typeof features === 'string') {
        features = features
          .split(/[,\r?\n]+/)
          .map(f => f.trim())
          .filter(f => f);
      }
      const packageData = {
        ...editedPackage,
        features,
      };
      console.log("packageData gửi lên:", packageData);
      if (isNew) {
        await PackageService.createPackage(packageData);
        message.success("Tạo gói thành công!");
      } else {
        await PackageService.updatePackage(selectedPackage._id, packageData);
        message.success("Cập nhật gói thành công!");
      }
      await fetchPackages(); // Đảm bảo fetch xong mới đóng modal
      setSelectedPackage(null);
      setIsNew(false);
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi khi lưu gói");
    } finally {
      setLoading(false);
    }
  };

  // Delete package
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await PackageService.deletePackage(id);
      message.success("Xóa gói thành công!");
      fetchPackages();
    } catch (err) {
      message.error(err.response?.data?.message || "Không thể xóa gói");
    } finally {
      setLoading(false);
    }
  };

  return {
    packages,
    loading,
    error,
    selectedPackage,
    setSelectedPackage,
    editedPackage,
    setEditedPackage,
    isNew,
    setIsNew,
    showConfirm,
    setShowConfirm,
    packageToDelete,
    setPackageToDelete,
    openEditModal,
    openNewModal,
    handleSaveChanges,
    handleDelete,
    fetchPackages,
  };
};

export default usePackages;
