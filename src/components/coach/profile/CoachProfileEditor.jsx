import { useState, useEffect } from "react";
import { Form, Input, InputNumber, Button, Card, Modal, message } from "antd";
import { useAuth } from "~/hooks/useAuth";
import useCoachData from "~/hooks/useCoachData";

const { TextArea } = Input;

/**
 * @param {('create'|'edit')} mode - chế độ tạo mới hay chỉnh sửa
 * @param {boolean} [visible] - chỉ dùng khi ở chế độ edit (modal)
 * @param {Function} [onCancel] - gọi khi nhấn Hủy (modal)
 * @param {Object} [profile] - dữ liệu hồ sơ (chỉ dùng khi sửa)
 * @param {Function} [onSuccess] - callback sau khi tạo/cập nhật thành công
 */
const CoachProfileEditor = ({
  mode = "create",
  visible = false,
  onCancel,
  profile,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { createCoachProfile, updateCoachProfile, loading } = useCoachData();
  const [submitting, setSubmitting] = useState(false);

  // Initialize form conditionally - create mode always shows form, edit mode only when visible
  const isEditMode = mode === "edit";
  const shouldRenderForm = !isEditMode || visible;
  const [form] = Form.useForm();

  // Populate form when editing
  useEffect(() => {
    if (shouldRenderForm && isEditMode && profile) {
      form.setFieldsValue({
        specialization: profile.specialization,
        experience_years: profile.experience_years,
        bio: profile.bio,
      });
    } else if (shouldRenderForm) {
      form.resetFields();
    }
  }, [isEditMode, profile, form, shouldRenderForm]);

  const handleFinish = async (values) => {
    try {
      setSubmitting(true);

      const profileData = {
        specialization: values.specialization,
        experience_years: Number(values.experience_years), // Ensure it's a number
        bio: values.bio,
      };

      if (isEditMode) {
        const coachId = profile?.coach_id?._id || currentUser?.userId;
        await updateCoachProfile(coachId, profileData);
        message.success("Cập nhật hồ sơ thành công!");
      } else {
        await createCoachProfile(profileData);
        message.success("Tạo hồ sơ huấn luyện viên thành công!");
        form.resetFields();
      }
      if (onSuccess) {
        onSuccess(profileData);
      }

      if (isEditMode) onCancel?.();
    } catch (error) {
      console.error("Profile creation/update error:", error);
      if (
        error?.response?.status === 400 &&
        error?.response?.data?.message === "Coach profile already exists"
      ) {
        message.error(
          "Hồ sơ huấn luyện viên đã tồn tại. Vui lòng chỉnh sửa hồ sơ hiện có."
        );
      } else if (error?.response?.status === 403) {
        message.error(
          "Bạn không có quyền tạo hồ sơ huấn luyện viên. Vui lòng liên hệ quản trị viên."
        );
      } else if (error?.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        const errorMessage =
          error?.response?.data?.message ||
          "Đã xảy ra lỗi. Vui lòng thử lại sau.";
        message.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Only render form content when it should be visible
  const FormContent = shouldRenderForm ? (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item
        name="specialization"
        label="Chuyên môn"
        rules={[
          { required: true, message: "Vui lòng nhập chuyên môn của bạn" },
        ]}
      >
        <Input placeholder="VD: Tư vấn cai thuốc lá, Tâm lý học" />
      </Form.Item>

      <Form.Item
        name="experience_years"
        label="Số năm kinh nghiệm"
        rules={[
          { required: true, message: "Vui lòng nhập số năm kinh nghiệm" },
        ]}
      >
        <InputNumber min={0} max={50} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="bio"
        label="Giới thiệu bản thân"
        rules={[{ required: true, message: "Vui lòng giới thiệu về bản thân" }]}
      >
        <TextArea
          rows={4}
          placeholder="Giới thiệu về kinh nghiệm và phương pháp làm việc..."
        />
      </Form.Item>

      <Form.Item className="flex justify-end">
        {isEditMode && (
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
        )}
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting || loading}
          className="bg-gradient-to-r from-purple-500 to-blue-500"
        >
          {isEditMode ? "Cập nhật" : "Tạo hồ sơ"}
        </Button>
      </Form.Item>
    </Form>
  ) : null;

  // In edit mode, only render when modal is visible
  if (isEditMode) {
    return visible ? (
      <Modal
        title="Chỉnh sửa hồ sơ huấn luyện viên"
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={700}
      >
        {FormContent}
      </Modal>
    ) : null;
  }

  // In create mode, always render
  return (
    <Card
      title="Tạo hồ sơ huấn luyện viên"
      className="max-w-3xl mx-auto shadow-md"
    >
      <p className="mb-4 text-gray-600">
        Hãy cung cấp thông tin chuyên môn của bạn để người dùng có thể hiểu rõ
        hơn về kinh nghiệm của bạn.
      </p>
      {FormContent}
    </Card>
  );
};

export default CoachProfileEditor;
