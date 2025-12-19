'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Form,
  Upload,
  Popconfirm,
  Card,
  Select,
  DatePicker,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { useAuthGuard } from '@/app/hooks/useAuthGuard';
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  type Article,
} from '@/app/lib/article-api';
import { App } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const BlogPage = () => {
  const { auth, ready } = useAuthGuard();
  const { message } = App.useApp();

  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [contentHtml, setContentHtml] = useState('');

  useEffect(() => {
    if (!ready || !auth) return;
    loadArticles();
  }, [ready, auth]);

  useEffect(() => {
    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [searchText, articles]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles(auth!.token);
      const list = Array.isArray(data) ? data : [];
      setArticles(list);
      setFilteredArticles(list);
    } catch (error) {
      message.error('Failed to load articles');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (article?: Article) => {
    setFileList([]);
    setContentHtml('');
    
    if (article) {
      setEditingId(article.id);
      form.setFieldsValue({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        author: article.author,
        status: article.status,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        publishedAt: article.publishedAt ? dayjs(article.publishedAt) : undefined,
      });
      setContentHtml(article.contentHtml || '');
      
      if (article.primaryImage) {
        setFileList([
          {
            uid: '-1',
            name: 'image.jpg',
            status: 'done',
            url: `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}${article.primaryImage}`,
          },
        ]);
      }
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldValue('status', 'DRAFT');
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
    setFileList([]);
    setContentHtml('');
  };

  const handleOk = async () => {
    try {
      if (!auth || !auth.token) {
        message.error('Not authenticated');
        return;
      }

      const values = await form.validateFields();
      setUploading(true);

      const formData = new FormData();
      formData.append('title', values.title);
      if (values.slug) formData.append('slug', values.slug);
      if (values.excerpt) formData.append('excerpt', values.excerpt);
      formData.append('contentHtml', contentHtml);
      if (values.author) formData.append('author', values.author);
      if (values.status) formData.append('status', values.status);
      if (values.seoTitle) formData.append('seoTitle', values.seoTitle);
      if (values.seoDescription) formData.append('seoDescription', values.seoDescription);
      if (values.publishedAt) {
        formData.append('publishedAt', values.publishedAt.toISOString());
      }

      if (fileList.length > 0) {
        const file = fileList[0];
        if (file.originFileObj) {
          formData.append('file', file.originFileObj);
        }
      }

      if (editingId) {
        await updateArticle(editingId, formData, auth.token);
        message.success('Article updated successfully');
      } else {
        await createArticle(formData, auth.token);
        message.success('Article created successfully');
      }

      setIsModalOpen(false);
      setEditingId(null);
      form.resetFields();
      setFileList([]);
      setContentHtml('');
      loadArticles();
    } catch (error) {
      message.error(editingId ? 'Failed to update article' : 'Failed to create article');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle(id, auth!.token);
      message.success('Article deleted successfully');
      loadArticles();
    } catch (error) {
      message.error('Failed to delete article');
      console.error(error);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList.slice(-1));
  };

  const columns: ColumnsType<Article> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 300,
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const color = status === 'PUBLISHED' ? 'success' : status === 'DRAFT' ? 'default' : 'warning';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Published Date',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: 150,
      render: (date: string) => date ? dayjs(date).format('YYYY-MM-DD') : '-',
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
            title="Delete Article"
            description="Are you sure you want to delete this article?"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog & Articles</h1>
          <p className="text-gray-600">Manage blog posts and articles</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => showModal()}
          className="bg-green-600 hover:bg-green-700"
        >
          Add New Post
        </Button>
      </div>

      <Card variant="borderless" className="shadow-sm">
        <div className="mb-4">
          <Input
            placeholder="Search articles..."
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
            dataSource={Array.isArray(filteredArticles) ? filteredArticles : []}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total ${total} articles`,
            }}
            scroll={{ x: 1000 }}
          />
        </Spin>
      </Card>

      <Modal
        title={editingId ? 'Edit Article' : 'Add New Article'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={uploading}
        width={900}
        okButtonProps={{ className: 'bg-green-600' }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label="Article Title"
            rules={[{ required: true, message: 'Please enter article title' }]}
          >
            <Input placeholder="Enter article title" size="large" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="slug" label="Slug">
              <Input placeholder="article-slug" size="large" />
            </Form.Item>

            <Form.Item name="author" label="Author">
              <Input placeholder="Author name" size="large" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="status" label="Status" initialValue="DRAFT">
              <Select size="large">
                <Option value="DRAFT">Draft</Option>
                <Option value="PUBLISHED">Published</Option>
                <Option value="ARCHIVED">Archived</Option>
              </Select>
            </Form.Item>

            <Form.Item name="publishedAt" label="Published Date">
              <DatePicker size="large" className="w-full" showTime />
            </Form.Item>
          </div>

          <Form.Item name="excerpt" label="Excerpt">
            <TextArea rows={2} placeholder="Short description..." />
          </Form.Item>

          <Form.Item label="Content (HTML)" required>
            <TextArea
              rows={12}
              value={contentHtml}
              onChange={(e) => setContentHtml(e.target.value)}
              placeholder="Enter HTML content here..."
            />
          </Form.Item>

          <Form.Item name="seoTitle" label="SEO Title">
            <Input placeholder="SEO title for search engines" />
          </Form.Item>

          <Form.Item name="seoDescription" label="SEO Description">
            <TextArea rows={2} placeholder="SEO description for search engines" />
          </Form.Item>

          <Form.Item label="Featured Image">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length === 0 && (
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogPage;
