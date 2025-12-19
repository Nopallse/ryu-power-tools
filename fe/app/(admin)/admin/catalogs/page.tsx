'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Space,
  Modal,
  Form,
  Upload,
  Empty,
  Statistic,
  Tag,
  Input,
  Spin,
  Table,
  Popconfirm,
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileOutlined,
  CloudUploadOutlined,
  PlusOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { ColumnsType } from 'antd/es/table';
import { useAuthGuard } from '@/app/hooks/useAuthGuard';
import {
  getCatalogues,
  createCatalogue,
  updateCatalogue,
  deleteCatalogue,
  type Catalogue,
} from '@/app/lib/catalogue-api';
import { App } from 'antd';
import dayjs from 'dayjs';

const CatalogsPage = () => {
  const { auth, ready } = useAuthGuard();
  const { message } = App.useApp();

  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (!ready || !auth) return;
    loadCatalogues();
  }, [ready, auth]);

  const loadCatalogues = async () => {
    setLoading(true);
    try {
      const data = await getCatalogues(auth!.token);
      const list = Array.isArray(data) ? data : [];
      setCatalogues(list);
    } catch (error) {
      message.error('Failed to load catalogues');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (catalogue?: Catalogue) => {
    setFileList([]);
    
    if (catalogue) {
      setEditingId(catalogue.id);
      form.setFieldsValue({
        title: catalogue.title,
      });
      
      if (catalogue.fileUrl) {
        setFileList([
          {
            uid: '-1',
            name: 'catalogue.pdf',
            status: 'done',
            url: `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}${catalogue.fileUrl}`,
          },
        ]);
      }
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
    setFileList([]);
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
      if (values.title) formData.append('title', values.title);

      if (fileList.length > 0) {
        const file = fileList[0];
        if (file.originFileObj) {
          formData.append('file', file.originFileObj);
        }
      } else if (!editingId) {
        message.error('Please upload a PDF file');
        setUploading(false);
        return;
      }

      if (editingId) {
        await updateCatalogue(editingId, formData, auth.token);
        message.success('Catalogue updated successfully');
      } else {
        await createCatalogue(formData, auth.token);
        message.success('Catalogue created successfully');
      }

      setIsModalOpen(false);
      setEditingId(null);
      form.resetFields();
      setFileList([]);
      loadCatalogues();
    } catch (error) {
      message.error(editingId ? 'Failed to update catalogue' : 'Failed to create catalogue');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCatalogue(id, auth!.token);
      message.success('Catalogue deleted successfully');
      loadCatalogues();
    } catch (error) {
      message.error('Failed to delete catalogue');
      console.error(error);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList.slice(-1));
  };

  const handleDownload = (fileUrl: string, title: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}${fileUrl}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = title || 'catalogue.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnsType<Catalogue> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => title || 'Untitled',
    },
    {
      title: 'File',
      dataIndex: 'fileUrl',
      key: 'fileUrl',
      render: (fileUrl: string) => (
        <div className="flex items-center gap-2">
          <FileOutlined className="text-blue-500" />
          <span className="text-sm text-gray-600">{fileUrl.split('/').pop()}</span>
        </div>
      ),
    },
    {
      title: 'Upload Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => date ? dayjs(date).format('YYYY-MM-DD') : '-',
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.fileUrl, record.title || 'catalogue')}
          />
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="Delete Catalogue"
            description="Are you sure you want to delete this catalogue?"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Catalogs</h1>
          <p className="text-gray-600">Manage product catalog PDF files</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => showModal()}
          className="bg-green-600 hover:bg-green-700"
        >
          Upload Catalog
        </Button>
      </div>

      {catalogues.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Table */}
          <div className="lg:col-span-2">
            <Card variant="borderless" className="shadow-sm">
              <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
                <Table
                  columns={columns}
                  dataSource={catalogues}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showTotal: (total) => `Total ${total} catalogues`,
                  }}
                />
              </Spin>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            <Card variant="borderless" className="shadow-sm">
              <Statistic
                title="Total Catalogues"
                value={catalogues.length}
                prefix={<FileOutlined />}
                valueStyle={{ color: '#2d6a2e' }}
              />
            </Card>

            <Card variant="borderless" className="shadow-sm">
              <div>
                <div className="text-xs text-gray-600 mb-2">Status</div>
                <Tag color="success" className="text-sm px-3 py-1">
                  Active
                </Tag>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card variant="borderless" className="shadow-sm text-center py-12">
          <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
            {!loading && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No catalog files uploaded yet"
                style={{ marginBottom: 24 }}
              >
                <Button
                  type="primary"
                  size="large"
                  icon={<CloudUploadOutlined />}
                  onClick={() => showModal()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Upload First Catalog
                </Button>
              </Empty>
            )}
          </Spin>
        </Card>
      )}

      {/* Upload/Edit Modal */}
      <Modal
        title={editingId ? 'Edit Catalog' : 'Upload New Catalog'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={uploading}
        width={600}
        okButtonProps={{ className: 'bg-green-600' }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label="Catalog Title"
            rules={[{ required: true, message: 'Please enter catalog title' }]}
          >
            <Input placeholder="e.g., Product Catalog 2025" size="large" />
          </Form.Item>

          <Form.Item
            label="Catalog File (PDF)"
            rules={[{ required: !editingId, message: 'Please upload PDF file' }]}
          >
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              maxCount={1}
              accept=".pdf"
              listType="text"
            >
              <Button icon={<UploadOutlined />} size="large" className="w-full">
                Click to Upload PDF
              </Button>
            </Upload>
          </Form.Item>

          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
            <strong>Note:</strong> Only PDF files are accepted. Maximum file size is 50MB.
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CatalogsPage;
