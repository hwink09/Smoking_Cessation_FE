import { Select } from "antd";

const options = [
    { value: "all", label: "Tất cả" },
    { value: "user_to_coach", label: "Người dùng → Huấn luyện viên" },
    { value: "coach_to_user", label: "Huấn luyện viên → Người dùng" },
    { value: "user_to_system", label: "Người dùng → Hệ thống" },
    { value: "user_to_plan", label: "Người dùng → Kế hoạch" },
];

export default function FeedbackFilter({ value, onChange }) {
    return (
        <Select
            value={value}
            onChange={onChange}
            options={options}
            className="w-60"
        />
    );
}
