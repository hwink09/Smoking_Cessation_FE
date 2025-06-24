import { Col } from "antd"

export function AchievementCard({ achievement }) {
  const Icon = achievement.icon

  return (
    <Col span={8}>
      <div
        className="text-center p-4 rounded-xl h-[100px] flex flex-col items-center justify-center 
                   transition-transform duration-300 ease-in-out hover:scale-105 shadow-sm"
        style={{
          backgroundColor: achievement.bgColor,
          border: `1px solid ${achievement.color}20`,
        }}
      >
        <Icon size={28} style={{ color: achievement.color, marginBottom: 8 }} />
        <div
          className="text-xs font-medium leading-tight break-words"
          style={{ color: achievement.color }}
        >
          {achievement.title}
        </div>
      </div>
    </Col>
  )
}
