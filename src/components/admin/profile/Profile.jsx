import React from 'react';
import { Card, Avatar, Form, Input, Button, Upload } from 'antd';
import { UserOutlined, MailOutlined, UploadOutlined } from '@ant-design/icons';

const Profile = ({ admin }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Form values:', values);
        // Xử lý cập nhật thông tin profile
    };

    return (
        <div className="p-6 min-h-screen">
            <Card className="max-w-2xl mx-auto">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        name: admin?.name,
                        email: admin?.email,
                    }}
                >
                    <div className="flex justify-center mb-6">
                        <Avatar
                            size={100}
                            src={admin?.avatar}
                            icon={<UserOutlined />}
                        />
                    </div>

                    <Form.Item
                        name="avatar"
                        label="Profile Picture"
                    >
                        <Upload>
                            <Button icon={<UploadOutlined />}>Change Avatar</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Full Name" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                    >
                        <Input
                            prefix={<MailOutlined />}
                            disabled
                            className="bg-gray-50"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500"
                        >
                            Update Profile
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Profile;