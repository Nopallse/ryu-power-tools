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
  Select,
  Upload,
  message,
  Popconfirm,
  Card,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';

const { Option } = Select;
const { TextArea } = Input;

interface Product {
  key: string;
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  featured: boolean;
  image: string;
}

const ProductsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const products: Product[] = [
    {
      key: '1',
      id: 'PRD001',
      name: 'Angle Grinder RYU-AG100',
      category: 'Power Tools',
      subcategory: 'Metal Working',
      price: 450000,
      stock: 25,
      status: 'active',
      featured: true,
      image: '/images/products/ag100.jpg',
    },
    {
      key: '2',
      id: 'PRD002',
      name: 'Circular Saw RYU-CS185',
      category: 'Power Tools',
      subcategory: 'Wood Working',
      price: 850000,
      stock: 15,
      status: 'active',
      featured: false,
      image: '/images/products/cs185.jpg',
    },
    {
      key: '3',
      id: 'PRD003',
      name: 'Impact Drill RYU-ID750',
      category: 'Power Tools',
      subcategory: 'Metal Working',
      price: 650000,
      stock: 0,
      status: 'inactive',
      featured: false,
      image: '/images/products/id750.jpg',
    },
  ];

  const columns: ColumnsType<Product> = [
    {
      title: 'Product ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      filteredValue: [searchText],
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Power Tools', value: 'Power Tools' },
        { text: 'Engine', value: 'Engine' },
        { text: 'Accessories', value: 'Accessories' },
      ],
      onFilter: (value, record) => record.category === value,
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
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <Tag color={stock > 0 ? 'success' : 'error'}>
          {stock > 0 ? `${stock} items` : 'Out of Stock'}
        </Tag>
      ),
      sorter: (a, b) => a.stock - b.stock,
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
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      key: 'featured',
      render: (featured: boolean) =>
        featured ? <Tag color="blue">Featured</Tag> : <Tag>Regular</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => message.info(`Viewing product: ${record.name}`)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete Product"
            description="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    message.success(`Product ${id} deleted successfully`);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      console.log('Form values:', values);
      message.success(editingProduct ? 'Product updated successfully' : 'Product added successfully');
      setIsModalOpen(false);
      form.resetFields();
      setEditingProduct(null);
    });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingProduct(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Products Management</h1>
          <p className="text-gray-600">Manage all your products, categories, and inventory</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          Add New Product
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <div className="mb-4">
          <Input
            placeholder="Search products by name..."
            prefix={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Table
          columns={columns}
          dataSource={products}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} products`,
          }}
        />
      </Card>

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={editingProduct ? 'Update' : 'Create'}
        okButtonProps={{ className: 'bg-green-600' }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input placeholder="e.g., Angle Grinder RYU-AG100" size="large" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select placeholder="Select category" size="large">
                <Option value="Power Tools">Power Tools</Option>
                <Option value="Engine">Engine</Option>
                <Option value="Accessories">Accessories</Option>
                <Option value="Welding">Welding</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="subcategory"
              label="Subcategory"
              rules={[{ required: true, message: 'Please select a subcategory' }]}
            >
              <Select placeholder="Select subcategory" size="large">
                <Option value="Metal Working">Metal Working</Option>
                <Option value="Wood Working">Wood Working</Option>
                <Option value="General Working">General Working</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="price"
              label="Price (Rp)"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <Input type="number" placeholder="450000" size="large" />
            </Form.Item>

            <Form.Item
              name="stock"
              label="Stock"
              rules={[{ required: true, message: 'Please enter stock quantity' }]}
            >
              <Input type="number" placeholder="25" size="large" />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Product description..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="status" label="Status" initialValue="active">
              <Select size="large">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>

            <Form.Item name="featured" label="Featured Product" initialValue={false}>
              <Select size="large">
                <Option value={true}>Yes</Option>
                <Option value={false}>No</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="image" label="Product Image">
            <Upload listType="picture-card" maxCount={1}>
              <div>
                <UploadOutlined />
                <div className="mt-2">Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
