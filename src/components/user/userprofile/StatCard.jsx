import { Card, Col } from "antd"

export function StatCard({ icon: Icon, value, label, color, backgroundColor, borderColor }) {
  return (
    <Col span={8}>
      <Card
        className="transition-transform duration-300 ease-in-out hover:scale-105 shadow-sm"
        style={{
          textAlign: "center",
          borderRadius: "12px",
          backgroundColor,
          border: `1px solid ${borderColor}`,
          height: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ padding: "8px 0" }}>
          <Icon size={24} style={{ color, marginBottom: "8px" }} />
          <div style={{ fontSize: "18px", fontWeight: "bold", color, lineHeight: "1.2" }}>
            {value}
          </div>
          <div style={{ fontSize: "11px", color, marginTop: "4px", lineHeight: "1.2" }}>
            {label}
          </div>
        </div>
      </Card>
    </Col>
  )
}
