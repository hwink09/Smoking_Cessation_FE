import { Table, Tag, message, Form, Space, Button, Popconfirm } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import EditUserModal from './EditUserModal';

const initialUsers = [
    { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", role: "user", status: "active", subscription: 'basic', },
    { id: 2, name: "Trần Thị B", email: "b@gmail.com", role: "admin", status: "inactive", subscription: 'basic', },
    { id: 3, name: "Trần Thị B", email: "b@gmail.com", role: "user", status: "inactive", subscription: 'premium', },
    { id: 4, name: "Trần Thị B", email: "b@gmail.com", role: "admin", status: "inactive", subscription: 'basic', },
];

export default function UserTable() {
    const [users, setUsers] = useState(initialUsers);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState(null);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        { title: "Email", dataIndex: "email", key: "email" },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role === 'admin' ? 'blue' : 'green'}>{role.toUpperCase()}</Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'success' : 'error'}>{status.toUpperCase()}</Tag>
            ),
        },
        {
            title: 'Subscription',
            dataIndex: 'subscription',
            key: 'subscription',
            render: (subscription) => (
                <Tag color={subscription === 'premium' ? 'gold' : 'default'}>{subscription.toUpperCase()}</Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => handleDelete(record)}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleEdit = (user) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setIsModalVisible(true);
    };

    const handleDelete = (user) => {

        const updatedUsers = users.filter(u => u.id !== user.id);
        setUsers(updatedUsers);

        // Handle delete logic here
        message.success('User deleted successfully');


    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            // Handle update logic here
            message.success('User information updated successfully');
            setIsModalVisible(false);
            form.resetFields();
            setEditingUser(null);
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditingUser(null);
    };

    return (
        <div className="overflow-hidden">
            <Table
                rowKey="id"
                columns={columns}
                dataSource={users}
                pagination={{
                    total: users.length,
                    pageSize: 10,
                    showTotal: (total) => `Total ${total} users`,
                }}
                className="bg-white rounded-xl"
            />

            <EditUserModal
                isVisible={isModalVisible}
                onCancel={handleModalCancel}
                onOk={handleModalOk}
                editingUser={editingUser}
                form={form}
            />
        </div>
    );
}