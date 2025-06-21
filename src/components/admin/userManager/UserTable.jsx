import { Table, Tag, message, Form, Space, Button, Popconfirm, Spin } from "antd";
import { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import EditUserModal from './EditUserModal';
import userService from "~/services/userService";

export default function UserTable() {
    const [users, setUsers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await userService.getAllUser();
                console.log('fetch user', response)
                setUsers(response.users);
            } catch (error) {
                message.error('Lỗi khi lấy danh sách người dùng', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const refetchUsers = async () => {
        try {
            const response = await userService.getAllUser();
            setUsers(response.users);
        } catch (error) {
            message.error('Lỗi khi tải lại danh sách người dùng', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        )
    }

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'avatar_url',
            key: 'avatar_url',
            render: (avatar_url) => (

                <img src={avatar_url} alt='Avatar' className="w-10 h-10 rounded-full" />

            ),
        },
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
                <Tag color={role === 'admin' ? 'blue' : role === 'coach' ? 'yellow' : 'green'}>{role.toUpperCase()}</Tag>
            ),
        },
        // {
        //     title: 'Subscription',
        //     dataIndex: 'subscription',
        //     key: 'subscription',
        //     render: (subscription) => (
        //         <Tag color={subscription === 'premium' ? 'gold' : 'default'}>{subscription.toUpperCase()}</Tag>
        //     ),
        // },
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
                            loading={deleteLoading}
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

    const handleDelete = async (user) => {
        try {
            setDeleteLoading(true);

            // Call API to delete user
            await userService.deleteUser(user.id);

            // Update local state after successful deletion
            const updatedUsers = users.filter(u => u.id !== user.id);
            setUsers(updatedUsers);

            message.success('Xóa người dùng thành công');
        } catch (error) {
            message.error('Lỗi khi xóa người dùng');
            console.error('Delete user error:', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleModalOk = async () => {
        try {
            setUpdateLoading(true);
            const values = await form.validateFields();

            const updatedUser = await userService.editUser(editingUser.id, values);

            const updatedUsers = users.map((user) =>
                user.id === editingUser.id ? { ...user, ...updatedUser } : user
            );
            setUsers(updatedUsers);
            setIsModalVisible(false);
            form.resetFields();
            setEditingUser(null);
            message.success('User updated successfully');
            await refetchUsers();

        } catch (error) {
            message.error('Lỗi khi cập nhật người dùng', error);
        } finally {
            setUpdateLoading(false);
        }

    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditingUser(null);
    };

    return (
        <div className="overflow-hidden">
            <Table
                rowKey={record => record.id || record.email}
                columns={columns}
                dataSource={users}
                loading={loading}
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
                confirmLoading={updateLoading}
            />
        </div>
    );
}