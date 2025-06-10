import { Table, Tag, Rate } from "antd";
import ActionButtons from "./ActionButtons";

export default function FeedbackTable({ data, onAction }) {
    const columns = [
        {
            title: "Người dùng",
            dataIndex: "user",
        },
        {
            title: "Loại",
            dataIndex: "feedback_type",
            render: (type) => <Tag>{type.replaceAll("_", " → ")}</Tag>,
        },
        {
            title: "Đối tượng",
            dataIndex: "target",
        },
        {
            title: "Sao",
            dataIndex: "rating",
            render: (r) => <Rate disabled defaultValue={r} />,
        },
        {
            title: "Bình luận",
            dataIndex: "content",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status) => <Tag color={status === "approved" ? "green" : "orange"}>{status}</Tag>,
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <ActionButtons
                    record={record}
                    onApprove={() => onAction(record.id, "approved")}
                    onHide={() => onAction(record.id, "hidden")}
                    onDelete={() => onAction(record.id, "delete")}
                />
            ),
        },
    ];

    return <Table className="bg-white rounded-lg" rowKey="id" columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />;
}
