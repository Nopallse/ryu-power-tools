'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  TreeSelect,
  Space,
  Popconfirm,
  Spin,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadFile, RcFile } from 'antd/es/upload/interface';
import { useAuthGuard } from '@/app/hooks/useAuthGuard';
import { useUnauthorizedHandler } from '@/app/hooks/useUnauthorizedHandler';
import {
  getCategories,
  getCategoryTree,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
  type TreeSelectNode,
} from '@/app/lib/category-api';
import { App } from 'antd';

export default function CategoriesPage() {
  const { auth, ready } = useAuthGuard();
  const { message } = App.useApp();
  const { handleError } = useUnauthorizedHandler();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<TreeSelectNode[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // Load categories
  useEffect(() => {
    if (!ready || !auth) return;
    loadCategories();
  }, [ready, auth]);

  // Filter categories
  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchText, categories]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const [data, tree] = await Promise.all([
        getCategories(auth!.token),
        getCategoryTree(auth!.token),
      ]);
      const list = Array.isArray(data) ? data : [];
      setCategories(list);
      setCategoryTree(Array.isArray(tree) ? tree : []);
      setFilteredCategories(list);
    } catch (error) {
      const wasUnauth = await handleError(error);
      if (!wasUnauth) {
        message.error('Failed to load categories');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (category?: Category) => {
    setFileList([]);
    if (category) {
      setEditingId(category.id);
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId || undefined,
      });
      if (category.imageUrl) {
        setFileList([
          {
            uid: '-1',
            name: 'image.jpg',
            status: 'done',
            url: `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}${category.imageUrl}`,
          },
        ]);
      }
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingId(null);
    form.resetFields();
    setFileList([]);
  };

  const handleOk = async () => {
    try {
      if (!auth || !auth.token) {
        console.error('Auth state:', auth);
        message.error('Not authenticated or token missing');
        return;
      }

      const values = await form.validateFields();
      setUploading(true);

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('slug', values.slug);
      if (values.description) {
        formData.append('description', values.description);
      }
      if (values.parentId) {
        formData.append('parentId', values.parentId);
      }

      // Handle file upload (API expects field name `file`)
      if (fileList.length > 0) {
        const file = fileList[0];
        if (file.originFileObj) {
          formData.append('file', file.originFileObj);
        }
      }

      console.log('Auth token before API call:', auth.token);
      if (editingId) {
        await updateCategory(editingId, formData, auth.token);
        message.success('Category updated successfully');
      } else {
        await createCategory(formData, auth.token);
        message.success('Category created successfully');
      }

      setIsModalVisible(false);
      setEditingId(null);
      form.resetFields();
      setFileList([]);
      loadCategories();
    } catch (error) {
      const wasUnauth = await handleError(error);
      if (!wasUnauth) {
        message.error(editingId ? 'Failed to update category' : 'Failed to create category');
      }
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id, auth!.token);
      message.success('Category deleted successfully');
      loadCategories();
    } catch (error) {
      const wasUnauth = await handleError(error);
      if (!wasUnauth) {
        message.error('Failed to delete category');
      }
      console.error(error);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList.slice(-1)); // Only keep the last file
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 150,
    },
    {
      title: 'Parent Category',
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId: string | null) => {
        if (!parentId) return '-';
        const parent = categories.find((cat) => cat.id === parentId);
        return parent?.name || '-';
      },
    },
    {
      title: 'Product Count',
      dataIndex: 'productCount',
      key: 'productCount',
      width: 120,
      align: 'center' as const,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: Category) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="Delete Category"
            description="Are you sure you want to delete this category?"
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
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
        <h1>Categories</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Add Category
        </Button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Input
          placeholder="Search categories..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
        <Table
          columns={columns}
          dataSource={Array.isArray(filteredCategories) ? filteredCategories : []}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} categories`,
          }}
        />
      </Spin>

      <Modal
        title={editingId ? 'Edit Category' : 'Add Category'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={uploading}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: '24px' }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: 'Please enter slug' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Parent Category"
            name="parentId"
          >
            <TreeSelect
              placeholder="Select parent category (optional)"
              treeData={categoryTree}
              allowClear
              treeDefaultExpandAll
              notFoundContent={categoryTree.length === 0 ? "No categories available" : "Not Found"}
            />
          </Form.Item>

          <Form.Item label="Image">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Handle upload manually
              maxCount={1}
            >
              {fileList.length === 0 && (
                <Button>Upload Image</Button>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
