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
  Upload,
  message,
  Popconfirm,
  Card,
  Select,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  StarFilled,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { TextArea } = Input;

interface FeaturedProduct {
  key: string;
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  displayOrder: number;
  status: 'active' | 'inactive';
  image: string;
}

const FeaturedProductsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const featuredProducts: FeaturedProduct[] = [
    {
      key: '1',
      id: 'FP001',
      name: 'RYU Angle Grinder 850W',
      category: 'Power Tools',
      subcategory: 'Grinding Tools',
      price: 450000,
      displayOrder: 1,
      status: 'active',
      image: '/images/products/grinder.jpg',
    },
    {
      key: '2',
      id: 'FP002',
      name: 'RYU Circular Saw 1400W',
      category: 'Power Tools',
      subcategory: 'Cutting Tools',
      price: 1200000,
      displayOrder: 2,
      status: 'active',
      image: '/images/products/saw.jpg',
    },
    {
      key: '3',
      id: 'FP003',
      name: 'RYU Impact Drill 650W',
      category: 'Power Tools',
      subcategory: 'Drilling Tools',
      price: 750000,
      displayOrder: 3,
      status: 'active',
      image: '/images/products/drill.jpg',
    },
  ];

  const columns: ColumnsType<FeaturedProduct> = [
    {
      title: 'Order',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 70,
      sorter: (a, b) => a.displayOrder - b.displayOrder,
      render: (order) => <Tag color="blue">{order}</Tag>,
    },
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      filteredValue: [searchText],
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toString().toLowerCase()),
      render: (text) => (
        <Space>
          <StarFilled className="text-yellow-500" />
          <span className="font-medium">{text}</span>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Subcategory',
      dataIndex: 'subcategory',
      key: 'subcategory',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `Rp ${price.toLocaleString('id-ID')}`,
      sorter: (a, b) => a.price - b.price,
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
      width: 150,
      render: () => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => setIsModalOpen(true)} />
          <Popconfirm
            title="Remove from Featured"
            description="Remove this product from featured list?"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Featured Products</h1>
          <p className="text-gray-600">Manage featured products displayed on homepage</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          Add Featured Product
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <div className="mb-4 flex justify-between items-center">
          <Input
            placeholder="Search featured products..."
            prefix={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
          <Tag color="gold" className="text-sm px-3 py-1">
            <StarFilled className="mr-1" />
            {featuredProducts.length} Featured Products
          </Tag>
        </div>

        <Table
          columns={columns}
          dataSource={featuredProducts}
          pagination={false}
        />
      </Card>

      <Modal
        title="Add Featured Product"
        open={isModalOpen}
        onOk={() => {
          form.validateFields().then(() => {
            message.success('Featured product added successfully');
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
              placeholder="Select product to feature"
              size="large"
              showSearch
              filterOption={(input, option) =>
                String(option?.label || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="1">RYU Angle Grinder 850W</Option>
              <Option value="2">RYU Circular Saw 1400W</Option>
              <Option value="3">RYU Impact Drill 650W</Option>
              <Option value="4">RYU Router 900W</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="displayOrder"
            label="Display Order"
            rules={[{ required: true, message: 'Please enter display order' }]}
            tooltip="Lower numbers appear first"
          >
            <InputNumber
              min={1}
              max={100}
              placeholder="1"
              size="large"
              className="w-full"
            />
          </Form.Item>

          <Form.Item name="highlightText" label="Highlight Text (Optional)">
            <Input placeholder="e.g., Best Seller, New Arrival" size="large" />
          </Form.Item>

          <Form.Item name="description" label="Description Override (Optional)">
            <TextArea
              rows={3}
              placeholder="Custom description for featured display..."
            />
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

export default FeaturedProductsPage;
