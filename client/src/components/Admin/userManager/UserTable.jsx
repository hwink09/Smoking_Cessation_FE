import { Table, Select, Tag } from "antd";
import { useState } from "react";

const initialUsers = [
    { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", role: "user", status: "active" },
    { id: 2, name: "Trần Thị B", email: "b@gmail.com", role: "admin", status: "inactive" },
    { id: 3, name: "Trần Thị B", email: "b@gmail.com", role: "admin", status: "inactive" },
    { id: 4, name: "Trần Thị B", email: "b@gmail.com", role: "admin", status: "inactive" },
];

export default function UserTable() {
    const [users, setUsers] = useState(initialUsers);

    const handleRoleChange = (id, newRole) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
        );
        // TODO: Gọi API cập nhật role thực tế
    };

    const columns = [
        { title: "Tên", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role, record) => (
                <Select
                    value={role}
                    onChange={(value) => handleRoleChange(record.id, value)}
                    style={{ width: 120 }}
                >
                    <Select.Option value="user">User</Select.Option>
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="coach">Coach</Select.Option>
                </Select>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) =>
                status === "active" ? (
                    <Tag color="cyan">Hoạt động</Tag>
                ) : (
                    <Tag color="magenta">Khóa</Tag>
                ),
        },
    ];

    return (
        <div className="overflow-hidden p-4">
            <Table
                rowKey="id"
                columns={columns}
                dataSource={users}
                pagination={true}
                className="bg-white rounded-xl"
            />
        </div>
    );
}