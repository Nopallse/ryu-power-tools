'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Popconfirm,
  Card,
  Spin,
  App,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuthGuard } from '@/app/hooks/useAuthGuard';
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  type Article,
} from '@/app/lib/article-api';
import dayjs from 'dayjs';
import ArticleForm from '@/app/components/ArticleForm';

const BlogPage = () => {
  const { auth, ready } = useAuthGuard();
  const { message } = App.useApp();

  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    if (article) {
      setEditingArticle(article);
    } else {
      setEditingArticle(null);
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (!auth || !auth.token) {
        message.error('Not authenticated');
        return;
      }

      setSubmitting(true);

      if (editingArticle) {
        await updateArticle(editingArticle.id, formData, auth.token);
        message.success('Article updated successfully');
      } else {
        await createArticle(formData, auth.token);
        message.success('Article created successfully');
      }

      await loadArticles();
    } catch (error) {
      message.error(editingArticle ? 'Failed to update article' : 'Failed to create article');
      console.error(error);
      throw error;
    } finally {
      setSubmitting(false);
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

      <ArticleForm
        open={isModalOpen}
        onClose={handleCancel}
        onSubmit={handleSubmit}
        article={editingArticle}
        loading={submitting}
        token={auth?.token || ''}
      />
    </div>
  );
};

export default BlogPage;
