'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Popconfirm,
  Card,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MailOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuthGuard } from '@/app/hooks/useAuthGuard';
import { useUnauthorizedHandler } from '@/app/hooks/useUnauthorizedHandler';
import {
  getServiceCenters,
  createServiceCenter,
  updateServiceCenter,
  deleteServiceCenter,
  type ServiceCenter,
} from '@/app/lib/service-center-api';
import { App } from 'antd';

const { TextArea } = Input;

const ServiceCentersPage = () => {
  const { auth, ready } = useAuthGuard();
  const { message } = App.useApp();
  const { handleError } = useUnauthorizedHandler();

  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [filteredServiceCenters, setFilteredServiceCenters] = useState<ServiceCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!ready || !auth) return;
    loadServiceCenters();
  }, [ready, auth]);

  useEffect(() => {
    const filtered = serviceCenters.filter((sc) =>
      sc.name.toLowerCase().includes(searchText.toLowerCase()) ||
      sc.address.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredServiceCenters(filtered);
  }, [searchText, serviceCenters]);

  const loadServiceCenters = async () => {
    setLoading(true);
    try {
      const data = await getServiceCenters(auth!.token);
      const list = Array.isArray(data) ? data : [];
      setServiceCenters(list);
      setFilteredServiceCenters(list);
    } catch (error) {
      const wasUnauth = await handleError(error);
      if (!wasUnauth) {
        message.error('Failed to load service centers');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (serviceCenter?: ServiceCenter) => {
    if (serviceCenter) {
      setEditingId(serviceCenter.id);
      form.setFieldsValue({
        name: serviceCenter.name,
        address: serviceCenter.address,
        phone: serviceCenter.phone,
        email: serviceCenter.email,
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      if (!auth || !auth.token) {
        message.error('Not authenticated');
        return;
      }

      const values = await form.validateFields();
      setSubmitting(true);

      if (editingId) {
        await updateServiceCenter(editingId, values, auth.token);
        message.success('Service center updated successfully');
      } else {
        await createServiceCenter(values, auth.token);
        message.success('Service center created successfully');
      }

      setIsModalOpen(false);
      setEditingId(null);
      form.resetFields();
      loadServiceCenters();
    } catch (error) {
      const wasUnauth = await handleError(error);
      if (!wasUnauth) {
        message.error(editingId ? 'Failed to update service center' : 'Failed to create service center');
      }
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteServiceCenter(id, auth!.token);
      message.success('Service center deleted successfully');
      loadServiceCenters();
    } catch (error) {
      const wasUnauth = await handleError(error);
      if (!wasUnauth) {
        message.error('Failed to delete service center');
      }
      console.error(error);
    }
  };

  const columns: ColumnsType<ServiceCenter> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <EnvironmentOutlined className="text-blue-500" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (phone: string) => (
        <div className="flex items-center gap-2">
          <PhoneOutlined />
          <span>{phone}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (email: string) => email ? (
        <div className="flex items-center gap-2">
          <MailOutlined />
          <span>{email}</span>
        </div>
      ) : '-',
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="Delete Service Center"
            description="Are you sure you want to delete this service center?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (!ready) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Centers</h1>
          <p className="text-gray-600">Manage service center locations and contact information</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => showModal()}
          className="bg-green-600 hover:bg-green-700"
        >
          Add Service Center
        </Button>
      </div>

      <Card variant="borderless" className="shadow-sm">
        <div className="mb-4">
          <Input
            placeholder="Search service centers..."
            prefix={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
          <Table
            columns={columns}
            dataSource={Array.isArray(filteredServiceCenters) ? filteredServiceCenters : []}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total ${total} service centers`,
            }}
            scroll={{ x: 1000 }}
          />
        </Spin>
      </Card>

      <Modal
        title={editingId ? 'Edit Service Center' : 'Add Service Center'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={submitting}
        width={700}
        okButtonProps={{ className: 'bg-green-600' }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Service Center Name"
            rules={[{ required: true, message: 'Please enter service center name' }]}
          >
            <Input placeholder="e.g., RYU Service Center Jakarta" size="large" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <TextArea
              rows={3}
              placeholder="Enter complete address..."
              size="large"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="e.g., 021-12345678"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="e.g., jakarta@ryu.com"
                size="large"
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceCentersPage;
