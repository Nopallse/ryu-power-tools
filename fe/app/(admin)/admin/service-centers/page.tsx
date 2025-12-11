'use client';

import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Form,
  message,
  Popconfirm,
  Card,
  Select,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MailOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { TextArea } = Input;

interface ServiceCenter {
  key: string;
  id: string;
  name: string;
  city: string;
  province: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
}

const ServiceCentersPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const serviceCenters: ServiceCenter[] = [
    {
      key: '1',
      id: 'SC001',
      name: 'Ryu Service Center Jakarta Pusat',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      address: 'Jl. Veteran No. 45, Jakarta Pusat',
      phone: '021-3456789',
      email: 'jakarta@ryuservice.com',
      status: 'active',
    },
    {
      key: '2',
      id: 'SC002',
      name: 'Ryu Service Center Surabaya',
      city: 'Surabaya',
      province: 'Jawa Timur',
      address: 'Jl. Diponegoro No. 123, Surabaya',
      phone: '031-7654321',
      email: 'surabaya@ryuservice.com',
      status: 'active',
    },
    {
      key: '3',
      id: 'SC003',
      name: 'Ryu Service Center Bandung',
      city: 'Bandung',
      province: 'Jawa Barat',
      address: 'Jl. Asia Afrika No. 88, Bandung',
      phone: '022-8765432',
      email: 'bandung@ryuservice.com',
      status: 'active',
    },
  ];

  const provinces = [
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'Jawa Timur',
    'Banten',
    'Sumatera Utara',
    'Sumatera Selatan',
    'Bali',
  ];

  const columns: ColumnsType<ServiceCenter> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Service Center Name',
      dataIndex: 'name',
      key: 'name',
      filteredValue: [searchText],
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toString().toLowerCase()) ||
        record.city.toLowerCase().includes(value.toString().toLowerCase()),
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">
            <EnvironmentOutlined className="mr-1" />
            {record.city}, {record.province}
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div className="text-sm">
          <div>
            <PhoneOutlined className="mr-1" />
            {record.phone}
          </div>
          <div className="text-gray-500">
            <MailOutlined className="mr-1" />
            {record.email}
          </div>
        </div>
      ),
    },
    {
      title: 'Province',
      dataIndex: 'province',
      key: 'province',
      filters: provinces.map(p => ({ text: p, value: p })),
      onFilter: (value, record) => record.province === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: () => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => setIsModalOpen(true)} />
          <Popconfirm
            title="Delete Service Center"
            description="Are you sure you want to delete this service center?"
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          Add Service Center
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <div className="mb-4">
          <Input
            placeholder="Search by name or city..."
            prefix={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Table
          columns={columns}
          dataSource={serviceCenters}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} service centers`,
          }}
        />
      </Card>

      <Modal
        title="Add New Service Center"
        open={isModalOpen}
        onOk={() => {
          form.validateFields().then(() => {
            message.success('Service center created successfully');
            setIsModalOpen(false);
            form.resetFields();
          });
        }}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={700}
        okButtonProps={{ className: 'bg-green-600' }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Service Center Name"
            rules={[{ required: true, message: 'Please enter service center name' }]}
          >
            <Input placeholder="e.g., Ryu Service Center Jakarta" size="large" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="province"
              label="Province"
              rules={[{ required: true, message: 'Please select province' }]}
            >
              <Select placeholder="Select province" size="large">
                {provinces.map(p => (
                  <Option key={p} value={p}>{p}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: 'Please enter city' }]}
            >
              <Input placeholder="e.g., Jakarta" size="large" />
            </Form.Item>
          </div>

          <Form.Item
            name="address"
            label="Full Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <TextArea rows={2} placeholder="Complete address..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input placeholder="021-1234567" size="large" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter valid email' }
              ]}
            >
              <Input placeholder="email@ryuservice.com" size="large" />
            </Form.Item>
          </div>

          <Form.Item name="operatingHours" label="Operating Hours">
            <TextArea rows={2} placeholder="e.g., Monday - Friday: 08:00 - 17:00" />
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="active">
            <Select size="large">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceCentersPage;
