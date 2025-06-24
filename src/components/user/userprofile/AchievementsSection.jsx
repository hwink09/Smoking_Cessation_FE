import { Card, Row } from "antd"
import { Award } from "lucide-react"
import { AchievementCard } from "./AchievementCard"

export function AchievementsSection({ achievements }) {
  return (
    <Card
      className="rounded-2xl mb-4 shadow-sm"
      title={
        <div className="flex items-center gap-2 text-base font-semibold text-gray-800">
          <Award size={20} style={{ color: "#1890ff" }} />
          <span>Thành tựu của bạn</span>
        </div>
      }
      bodyStyle={{ padding: "16px" }}
    >
      <Row gutter={[8, 8]}>
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </Row>
    </Card>
  )
}
