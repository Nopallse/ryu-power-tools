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

interface NewsArticle {
  key: string;
  id: string;
  title: string;
  category: string;
  status: 'published' | 'draft';
  views: number;
  publishedDate: string;
}

const NewsPage = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const newsArticles: NewsArticle[] = [
    {
      key: '1',
      id: 'NEWS001',
      title: 'Ryu Meluncurkan Produk Terbaru 2025',
      category: 'Product Launch',
      status: 'published',
      views: 2340,
      publishedDate: '2025-12-15',
    },
    {
      key: '2',
      id: 'NEWS002',
      title: 'Partnership Dengan Distributor Baru',
      category: 'Company News',
      status: 'published',
      views: 1890,
      publishedDate: '2025-12-12',
    },
    {
      key: '3',
      id: 'NEWS003',
      title: 'Promo Akhir Tahun 2025',
      category: 'Promotions',
      status: 'draft',
      views: 0,
      publishedDate: '-',
    },
  ];

  const columns: ColumnsType<NewsArticle> = [
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
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Product Launch', value: 'Product Launch' },
        { text: 'Company News', value: 'Company News' },
        { text: 'Promotions', value: 'Promotions' },
        { text: 'Events', value: 'Events' },
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
            title="Delete News Article"
            description="Are you sure you want to delete this article?"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">News & Articles</h1>
          <p className="text-gray-600">Manage company news and announcements</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          Add News Article
        </Button>
      </div>

      <Card bordered={false} className="shadow-sm">
        <div className="mb-4">
          <Input
            placeholder="Search news articles..."
            prefix={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Table
          columns={columns}
          dataSource={newsArticles}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} articles`,
          }}
        />
      </Card>

      <Modal
        title="Add News Article"
        open={isModalOpen}
        onOk={() => {
          form.validateFields().then(() => {
            message.success('News article created successfully');
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
            label="Article Title"
            rules={[{ required: true, message: 'Please enter article title' }]}
          >
            <Input placeholder="Enter news article title" size="large" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="category" label="Category">
              <Select placeholder="Select category" size="large">
                <Option value="Product Launch">Product Launch</Option>
                <Option value="Company News">Company News</Option>
                <Option value="Promotions">Promotions</Option>
                <Option value="Events">Events</Option>
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
            <TextArea rows={8} placeholder="Write your news content here..." />
          </Form.Item>

          <Form.Item name="featuredImage" label="Featured Image">
            <Upload listType="picture-card" maxCount={1}>
              <div>
                <UploadOutlined />
                <div className="mt-2">Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item name="publishDate" label="Publish Date">
            <Input type="date" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsPage;
