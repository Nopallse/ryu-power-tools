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
  TreeSelect,
  message,
  Popconfirm,
  Card,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface Category {
  key: string;
  id: string;
  name: string;
  slug: string;
  parent: string;
  productCount: number;
  status: 'active' | 'inactive';
}

const CategoriesPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const categories: Category[] = [
    {
      key: '1',
      id: 'CAT001',
      name: 'Power Tools',
      slug: 'power-tools',
      parent: '-',
      productCount: 89,
      status: 'active',
    },
    {
      key: '2',
      id: 'CAT002',
      name: 'Metal Working',
      slug: 'metal-working',
      parent: 'Power Tools',
      productCount: 35,
      status: 'active',
    },
    {
      key: '3',
      id: 'CAT003',
      name: 'Wood Working',
      slug: 'wood-working',
      parent: 'Power Tools',
      productCount: 28,
      status: 'active',
    },
    {
      key: '4',
      id: 'CAT004',
      name: 'Engine',
      slug: 'engine',
      parent: '-',
      productCount: 25,
      status: 'active',
    },
    {
      key: '5',
      id: 'CAT005',
      name: 'Accessories',
      slug: 'accessories',
      parent: '-',
      productCount: 42,
      status: 'active',
    },
  ];

  const treeData = [
    {
      title: 'None (Main Category)',
      value: '-',
    },
    {
      title: 'Power Tools',
      value: 'power-tools',
      children: [
        { title: 'Metal Working', value: 'metal-working' },
        { title: 'Wood Working', value: 'wood-working' },
      ],
    },
    {
      title: 'Engine',
      value: 'engine',
    },
  ];

  const columns: ColumnsType<Category> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      filteredValue: [searchText],
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toString().toLowerCase()),
      render: (text, record) => (
        <Space>
          <FolderOutlined className="text-yellow-500" />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Parent Category',
      dataIndex: 'parent',
      key: 'parent',
    },
    {
      title: 'Products',
      dataIndex: 'productCount',
      key: 'productCount',
      sorter: (a, b) => a.productCount - b.productCount,
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
            title="Delete Category"
            description="This will also affect subcategories. Continue?"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Categories Management</h1>
          <p className="text-gray-600">Manage product categories and subcategories</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          Add Category
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <div className="mb-4">
          <Input
            placeholder="Search categories..."
            prefix={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} categories`,
          }}
        />
      </Card>

      <Modal
        title="Add New Category"
        open={isModalOpen}
        onOk={() => {
          form.validateFields().then(() => {
            message.success('Category created successfully');
            setIsModalOpen(false);
            form.resetFields();
          });
        }}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={600}
        okButtonProps={{ className: 'bg-green-600' }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="e.g., Power Tools" size="large" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Please enter slug' }]}
          >
            <Input placeholder="e.g., power-tools" size="large" />
          </Form.Item>

          <Form.Item name="parent" label="Parent Category">
            <TreeSelect
              treeData={treeData}
              placeholder="Select parent category"
              size="large"
              treeDefaultExpandAll
            />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Category description..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
