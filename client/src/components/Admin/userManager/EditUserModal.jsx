import { Modal, Form, Input, Select } from 'antd';

const EditUserModal = ({ isVisible, onCancel, onOk, editingUser, form }) => {
    return (
        <Modal
            title={editingUser ? "Edit User" : "Add New User"}
            open={isVisible}
            onOk={onOk}
            onCancel={onCancel}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ role: 'user', status: 'active', subscription: 'basic' }}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please input the name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please input the email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="role"
                    label="Role"
                >
                    <Select>
                        <Select.Option value="user">User</Select.Option>
                        <Select.Option value="admin">Admin</Select.Option>
                        <Select.Option value="coach">Coach</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                >
                    <Select>
                        <Select.Option value="active">Active</Select.Option>
                        <Select.Option value="inactive">Inactive</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="subscription"
                    label="Subscription"
                >
                    <Select>
                        <Select.Option value="basic">Basic</Select.Option>
                        <Select.Option value="premium">Premium</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditUserModal;