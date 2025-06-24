import { Modal, Form, Input, Upload, Avatar, Button} from "antd"
import { Edit, Camera, User, Mail, Phone } from "lucide-react"

export function EditProfileModal({ 
  isVisible, 
  onCancel, 
  onSave, 
  user, 
  form,
  handleAvatarUpload,
  avatarPreviewUrl, 
}) {
  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Edit size={20} style={{ color: "#1890ff" }} />
          <span>Chỉnh sửa hồ sơ</span>
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={500}
      style={{ top: 20 }}
    >
      <Form form={form} layout="vertical" onFinish={onSave} style={{ marginTop: "24px" }}>
        {/* Avatar Upload Section */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Avatar
              size={80}
              src={avatarPreviewUrl || user.avatar_url}
              style={{
                border: "3px solid #1890ff",
                boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
              }}
            />
            <Upload 
              showUploadList={false} 
              beforeUpload={(file) => {
                handleAvatarUpload(file);
                return false;
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  width: "28px",
                  height: "28px",
                  backgroundColor: "#1890ff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <Camera size={14} style={{ color: "white" }} />
              </div>
            </Upload>
          </div>
          <div style={{ marginTop: "8px", fontSize: "12px", color: "#8c8c8c" }}>
            Nhấp vào biểu tượng camera để thay đổi ảnh đại diện
          </div>
        </div>

        <Form.Item name="avatar_url" hidden>
            <Input />
        </Form.Item>

        <Form.Item
          label={
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <User size={14} />
              <span>Họ và tên</span>
            </div>
          }
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập họ và tên!" },
            { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự!" },
          ]}
        >
          <Input size="large" placeholder="Nhập họ và tên" prefix={<User size={16} style={{ color: "#d9d9d9" }} />} />
        </Form.Item>
        <Form.Item
          label={
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Mail size={14} />
              <span>Email</span>
            </div>
          }
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input
            size="large"
            placeholder="Nhập địa chỉ email"
            prefix={<Mail size={16} style={{ color: "#d9d9d9" }} />}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: "32px" }}>
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <Button onClick={onCancel} size="large">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" size="large" icon={<Edit size={16} />}>
              Lưu thay đổi
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>

  )
}