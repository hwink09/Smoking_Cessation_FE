import { Avatar, Card, Button, Typography } from "antd"
import { Edit, Camera } from "lucide-react"
import { useAuth } from "~/hooks/useAuth";


const { Title, Text } = Typography

export function ProfileHeader({ onEditProfile }) {
    const {currentUser: user} = useAuth();
  return (
    <Card
      style={{
        marginBottom: "16px",
        borderRadius: "16px",
        textAlign: "center",
        border: "2px ",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      }}
    >
      <div style={{ padding: "20px 0" }}>
        <div style={{ position: "relative", display: "inline-block", marginBottom: "16px" }}>
          <Avatar
            size={120}
            src={user?.avatar_url || "https://cdn-media.sforum.vn/storage/app/media/ve-capybara-2.jpg"} 
            style={{
              border: "4px solid #1890ff",
              boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              right: "8px",
              width: "32px",
              height: "32px",
              backgroundColor: "#1890ff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <Camera size={16} style={{ color: "white" }} />
          </div>
        </div>
        <Title level={3} style={{ margin: "0 0 4px 0", color: "#262626" }}>
          {user.name}
        </Title>
        <Text style={{ color: "#8c8c8c", fontSize: "14px" }}>{user.email}</Text>
        <div style={{ marginTop: "16px" }}>
          <Button
            type="primary"
            icon={<Edit size={16} />}
            onClick={onEditProfile}
            style={{
              borderRadius: "20px",
              height: "40px",
              paddingLeft: "24px",
              paddingRight: "24px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Chỉnh sửa hồ sơ
          </Button>
        </div>
      </div>
    </Card>
  )
}