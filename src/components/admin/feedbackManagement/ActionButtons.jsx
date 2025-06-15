import { Button, Popconfirm } from "antd";
import {
    CheckOutlined,
    EyeInvisibleOutlined,
    DeleteOutlined,
} from "@ant-design/icons";

export default function ActionButtons({ record, onApprove, onHide, onDelete }) {
    return (
        <div className="flex gap-2">
            {record.status !== "approved" && (
                <Button icon={<CheckOutlined />} type="link" onClick={onApprove}>
                    Duyệt
                </Button>
            )}
            <Button
                icon={<EyeInvisibleOutlined />}
                type="link"
                onClick={onHide}
            >
                Ẩn
            </Button>
            <Popconfirm
                title="Xóa đánh giá này?"
                onConfirm={onDelete}
                okText="Xóa"
                cancelText="Hủy"
            >
                <Button icon={<DeleteOutlined />} type="link" danger>
                    Xóa
                </Button>
            </Popconfirm>
        </div>
    );
}
