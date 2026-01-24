"use client";

import { useEffect } from "react";
import { Card, Form, Input, Button, Typography, App } from "antd";
import { useRouter } from "next/navigation";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { login } from "@/app/lib/auth-client";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";

const { Title, Text } = Typography;

const LoginPage = () => {
  const router = useRouter();
  const { auth, ready } = useAuthGuard(["/log8i8n738"]);
  const { message } = App.useApp();

  useEffect(() => {
    if (ready && auth) {
      router.replace("/admin/dashboard");
    }
  }, [auth, ready, router]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    const hide = message.loading("Signing in...");
    try {
      await login(values.email, values.password);
      hide();
      message.success("Login successful");
      router.replace("/admin/dashboard");
    } catch (error) {
      hide();
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      message.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-md">
        <div className="text-center mb-6">
          <Title level={3} className="mb-1">
            Admin Login
          </Title>
          <Text type="secondary">Access your dashboard with your credentials</Text>
        </div>
        <Form layout="vertical" onFinish={handleSubmit} requiredMark={false} autoComplete="off">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Invalid email" }]}
          >
            <Input size="large" prefix={<MailOutlined />} placeholder="admin@ryu.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="••••••••" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" className="bg-green-600 hover:bg-green-700">
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
