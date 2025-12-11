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
  InputNumber,
  DatePicker,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { TextArea } = Input;

interface LatestProduct {
  key: string;
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  addedDate: string;
  displayUntil: string;
  status: 'active' | 'expired';
  badge: string;
}

const LatestProductsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const latestProducts: LatestProduct[] = [
    {
      key: '1',
      id: 'LP001',
      name: 'RYU Router 900W',
      category: 'Power Tools',
      subcategory: 'Routing Tools',
      price: 950000,
      addedDate: '2025-12-15',
      displayUntil: '2025-02-15',
      status: 'active',
      badge: 'NEW',
    },
    {
      key: '2',
      id: 'LP002',
      name: 'RYU Pressure Washer 1800W',
      category: 'Cleaning Tools',
      subcategory: 'Washers',
      price: 1500000,
      addedDate: '2025-12-10',
      displayUntil: '2025-02-10',
      status: 'active',
      badge: 'JUST ARRIVED',
    },
    {
      key: '3',
      id: 'LP003',
      name: 'RYU Air Compressor 24L',
      category: 'Air Tools',
      subcategory: 'Compressors',
      price: 2200000,
      addedDate: '2025-11-20',
      displayUntil: '2025-01-20',
      status: 'expired',
      badge: 'NEW',
    },
  ];

  const columns: ColumnsType<LatestProduct> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 90,
    },
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      filteredValue: [searchText],
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toString().toLowerCase()),
      render: (text, record) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{text}</span>
            <Tag color="orange" className="text-xs">{record.badge}</Tag>
          </div>
          <div className="text-sm text-gray-500">
            {record.category} • {record.subcategory}
          </div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `Rp ${price.toLocaleString('id-ID')}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Added Date',
      dataIndex: 'addedDate',
      key: 'addedDate',
      sorter: (a, b) => new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime(),
    },
    {
      title: 'Display Until',
      dataIndex: 'displayUntil',
      key: 'displayUntil',
      render: (date, record) => (
        <div className={record.status === 'expired' ? 'text-red-500' : ''}>
          <ClockCircleOutlined className="mr-1" />
          {date}
        </div>
      ),
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
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Expired', value: 'expired' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: () => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => setIsModalOpen(true)} />
          <Popconfirm
            title="Remove from Latest"
            description="Remove this product from latest products?"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Latest Products</h1>
          <p className="text-gray-600">Manage newest products displayed on homepage</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          Add Latest Product
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <div className="mb-4 flex justify-between items-center">
          <Input
            placeholder="Search latest products..."
            prefix={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
          <Space>
            <Tag color="success">
              {latestProducts.filter(p => p.status === 'active').length} Active
            </Tag>
            <Tag>
              {latestProducts.filter(p => p.status === 'expired').length} Expired
            </Tag>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={latestProducts}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} products`,
          }}
        />
      </Card>

      <Modal
        title="Add Latest Product"
        open={isModalOpen}
        onOk={() => {
          form.validateFields().then(() => {
            message.success('Latest product added successfully');
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
            name="productId"
            label="Select Product"
            rules={[{ required: true, message: 'Please select a product' }]}
          >
            <Select
              placeholder="Select new product"
              size="large"
              showSearch
              filterOption={(input, option) =>
                String(option?.label || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="1">RYU Router 900W</Option>
              <Option value="2">RYU Pressure Washer 1800W</Option>
              <Option value="3">RYU Air Compressor 24L</Option>
              <Option value="4">RYU Polisher 1200W</Option>
            </Select>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="badge"
              label="Badge Text"
              rules={[{ required: true, message: 'Please enter badge text' }]}
            >
              <Select placeholder="Select badge" size="large">
                <Option value="NEW">NEW</Option>
                <Option value="JUST ARRIVED">JUST ARRIVED</Option>
                <Option value="LATEST">LATEST</Option>
                <Option value="2025">2025</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="displayDays"
              label="Display Duration (Days)"
              rules={[{ required: true, message: 'Please enter duration' }]}
              tooltip="How many days to show in latest section"
            >
              <InputNumber
                min={7}
                max={90}
                placeholder="30"
                size="large"
                className="w-full"
              />
            </Form.Item>
          </div>

          <Form.Item name="highlightText" label="Highlight Text (Optional)">
            <Input placeholder="e.g., Limited Stock, Pre-Order" size="large" />
          </Form.Item>

          <Form.Item name="description" label="Description Override (Optional)">
            <TextArea
              rows={3}
              placeholder="Custom description for latest display..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LatestProductsPage;
