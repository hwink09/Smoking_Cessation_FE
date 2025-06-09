import { Card, Rate } from "antd";

export default function FeedbackStats({ average }) {
    return (
        <Card className="mb-6 bg-gray-50">
            <p className="text-gray-600">⭐ Đánh giá trung bình:</p>
            <div className="flex items-center gap-2">
                <Rate disabled allowHalf value={parseFloat(average)} />
                <span className="text-lg font-medium">{average}/5</span>
            </div>
        </Card>
    );
}
