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

const { TextArea } = Input;
const { Option } = Select;

interface BlogPost {
  key: string;
  id: string;
  title: string;
  author: string;
  category: string;
  status: 'published' | 'draft';
  views: number;
  publishedDate: string;
}

const BlogPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const blogPosts: BlogPost[] = [
    {
      key: '1',
      id: 'BLOG001',
      title: 'Tips Memilih Power Tools Yang Tepat',
      author: 'Admin',
      category: 'Tips & Tricks',
      status: 'published',
      views: 1250,
      publishedDate: '2025-12-10',
    },
    {
      key: '2',
      id: 'BLOG002',
      title: 'Perawatan Mesin Gerinda Agar Awet',
      author: 'Admin',
      category: 'Maintenance',
      status: 'published',
      views: 890,
      publishedDate: '2025-12-08',
    },
    {
      key: '3',
      id: 'BLOG003',
      title: 'Panduan Keselamatan Kerja',
      author: 'Admin',
      category: 'Safety',
      status: 'draft',
      views: 0,
      publishedDate: '-',
    },
  ];

  const columns: ColumnsType<BlogPost> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      filteredValue: [searchText],
      onFilter: (value, record) =>
        record.title.toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Tips & Tricks', value: 'Tips & Tricks' },
        { text: 'Maintenance', value: 'Maintenance' },
        { text: 'Safety', value: 'Safety' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'published' ? 'success' : 'default'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: 'Published Date',
      dataIndex: 'publishedDate',
      key: 'publishedDate',
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => setIsModalOpen(true)} />
          <Popconfirm
            title="Delete Blog Post"
            description="Are you sure you want to delete this blog post?"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog & Articles</h1>
          <p className="text-gray-600">Manage blog posts and articles</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          Add New Post
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <div className="mb-4">
          <Input
            placeholder="Search blog posts..."
            prefix={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Table
          columns={columns}
          dataSource={blogPosts}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} posts`,
          }}
        />
      </Card>

      <Modal
        title="Add New Blog Post"
        open={isModalOpen}
        onOk={() => {
          form.validateFields().then(() => {
            message.success('Blog post created successfully');
            setIsModalOpen(false);
            form.resetFields();
          });
        }}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={800}
        okButtonProps={{ className: 'bg-green-600' }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label="Post Title"
            rules={[{ required: true, message: 'Please enter post title' }]}
          >
            <Input placeholder="Enter blog post title" size="large" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="category" label="Category">
              <Select placeholder="Select category" size="large">
                <Option value="Tips & Tricks">Tips & Tricks</Option>
                <Option value="Maintenance">Maintenance</Option>
                <Option value="Safety">Safety</Option>
                <Option value="Product Review">Product Review</Option>
              </Select>
            </Form.Item>

            <Form.Item name="status" label="Status" initialValue="draft">
              <Select size="large">
                <Option value="draft">Draft</Option>
                <Option value="published">Published</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="excerpt" label="Excerpt">
            <TextArea rows={2} placeholder="Short description..." />
          </Form.Item>

          <Form.Item name="content" label="Content">
            <TextArea rows={8} placeholder="Write your blog content here..." />
          </Form.Item>

          <Form.Item name="featuredImage" label="Featured Image">
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

export default BlogPage;
