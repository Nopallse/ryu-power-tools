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
  Popconfirm,
  Descriptions,
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileOutlined,
  CloudUploadOutlined,
  LoadingOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useAuthGuard } from '@/app/hooks/useAuthGuard';
import { useUnauthorizedHandler } from '@/app/hooks/useUnauthorizedHandler';
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
  const { handleError } = useUnauthorizedHandler();

  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const isValidCatalogue = (item: Catalogue | null) =>
    Boolean(item?.id && item.id !== 'undefined' && item.fileUrl);

  useEffect(() => {
    if (!ready || !auth) return;
    loadCatalogue();
  }, [ready, auth]);

  const loadCatalogue = async () => {
    setLoading(true);
    try {
      const data = await getCatalogues(auth!.token);
      // Backend mengembalikan single object atau null
      setCatalogue(data || null);
    } catch (error) {
      const wasUnauth = await handleError(error);
      if (!wasUnauth) {
        message.error('Failed to load catalogue');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setFileList([]);

    const activeCatalogue = isValidCatalogue(catalogue) ? catalogue : null;

    if (activeCatalogue) {
      // Mode: Update existing catalogue
      form.setFieldsValue({
        title: activeCatalogue.title,
      });
      
      // Don't pre-load file - let user choose to upload new file or not
      // Only show existing file info in description
    } else {
      // Mode: Add new catalogue
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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

      // Handle file upload
      if (fileList.length > 0) {
        const file = fileList[0];
        if (file.originFileObj) {
          const fileObj = file.originFileObj as File;
          formData.append('file', fileObj, file.name || fileObj.name);
        }
      }

      const activeCatalogue = isValidCatalogue(catalogue) ? catalogue : null;

      if (activeCatalogue) {
        // Update existing catalogue - backend auto replaces with POST
        const debugFile = fileList[0]?.originFileObj as File | undefined;
        console.log('Catalogue update payload:', {
          title: values.title,
          file: debugFile
            ? { name: fileList[0]?.name, size: debugFile.size, type: debugFile.type }
            : null,
        });
        
        // Backend auto replaces when POST is called
        if (fileList.length === 0 || !fileList[0].originFileObj) {
          message.error('Please upload a PDF file');
          setUploading(false);
          return;
        }
        await createCatalogue(formData, auth.token);
        message.success('Catalogue updated successfully');
      } else {
        // Create new catalogue (POST)
        // File is required when creating
        if (fileList.length === 0 || !fileList[0].originFileObj) {
          message.error('Please upload a PDF file');
          setUploading(false);
          return;
        }
        await createCatalogue(formData, auth.token);
        message.success('Catalogue uploaded successfully');
      }

      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
      loadCatalogue();
    } catch (error) {
      const wasUnauth = await handleError(error);
      if (!wasUnauth) {
        message.error(catalogue ? 'Failed to update catalogue' : 'Failed to upload catalogue');
      }
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!catalogue?.id || catalogue.id === 'undefined') return;
    
    try {
      await deleteCatalogue(catalogue.id, auth!.token);
      message.success('Catalogue deleted successfully');
      setCatalogue(null);
    } catch (error) {
      const wasUnauth = await handleError(error);
      if (!wasUnauth) {
        message.error('Failed to delete catalogue');
      }
      console.error(error);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList.slice(-1));
  };

  const handleDownload = () => {
    if (!catalogue?.fileUrl) return;
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}${catalogue.fileUrl}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = catalogue.title || 'catalogue.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!ready) return null;

  const activeCatalogue = isValidCatalogue(catalogue) ? catalogue : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Catalog</h1>
          <p className="text-gray-600">Manage your product catalog PDF file</p>
        </div>
        {!activeCatalogue && (
          <Button
            type="primary"
            icon={<CloudUploadOutlined />}
            size="large"
            onClick={showModal}
            className="bg-green-600 hover:bg-green-700"
          >
            Upload Catalog
          </Button>
        )}
      </div>

      <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
        {activeCatalogue ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card 
                variant="borderless" 
                className="shadow-sm"
                title={
                  <div className="flex items-center gap-2">
                    <FilePdfOutlined className="text-red-500 text-xl" />
                    <span className="text-lg font-semibold">Current Catalog</span>
                  </div>
                }
              >
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Title">
                    <span className="font-medium">{activeCatalogue.title || 'Untitled'}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="File Name">
                    {activeCatalogue.fileUrl.split('/').pop() || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="File URL">
                    {activeCatalogue.fileUrl ? (
                      <a 
                        href={`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}${activeCatalogue.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}${activeCatalogue.fileUrl}`}
                      </a>
                    ) : (
                      <span className="text-gray-400">No file URL</span>
                    )}
                  </Descriptions.Item>
                  {activeCatalogue.createdAt && (
                    <Descriptions.Item label="Upload Date">
                      {dayjs(activeCatalogue.createdAt).format('MMMM DD, YYYY HH:mm')}
                    </Descriptions.Item>
                  )}
                  {activeCatalogue.updatedAt && (
                    <Descriptions.Item label="Last Updated">
                      {dayjs(activeCatalogue.updatedAt).format('MMMM DD, YYYY HH:mm')}
                    </Descriptions.Item>
                  )}
                </Descriptions>

                <div className="mt-6 flex gap-3">
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    size="large"
                    onClick={handleDownload}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Download
                  </Button>
                  <Button
                    icon={<EditOutlined />}
                    size="large"
                    onClick={showModal}
                  >
                    Update
                  </Button>
                  <Popconfirm
                    title="Delete Catalogue"
                    description="Are you sure you want to delete this catalogue? This action cannot be undone."
                    onConfirm={handleDelete}
                    okText="Yes, Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <Button 
                      danger 
                      icon={<DeleteOutlined />}
                      size="large"
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          !loading && (
            <Card variant="borderless" className="shadow-sm text-center py-12">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No catalog file uploaded yet"
                style={{ marginBottom: 24 }}
              >
                <Button
                  type="primary"
                  size="large"
                  icon={<CloudUploadOutlined />}
                  onClick={showModal}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Upload Your First Catalog
                </Button>
              </Empty>
            </Card>
          )
        )}
      </Spin>

      {/* Upload/Edit Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            {activeCatalogue ? <EditOutlined /> : <CloudUploadOutlined />}
            <span>{activeCatalogue ? 'Update Catalog' : 'Upload New Catalog'}</span>
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={uploading}
        width={600}
        okText={activeCatalogue ? 'Update Catalog' : 'Add Catalog'}
        okButtonProps={{ className: activeCatalogue ? 'bg-blue-600' : 'bg-green-600' }}
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
            label={activeCatalogue ? "Catalog File (PDF) - Required for Update" : "Catalog File (PDF)"}
            rules={[{ required: true, message: 'Please upload PDF file' }]}
          >
            {activeCatalogue && (
              <div className="mb-3 p-2 bg-gray-100 rounded text-sm">
                <strong>Current file:</strong> {activeCatalogue.fileUrl.split('/').pop()}
              </div>
            )}
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              maxCount={1}
              accept=".pdf"
              listType="text"
            >
              <Button icon={<UploadOutlined />} size="large" className="w-full">
                {activeCatalogue ? 'Click to Upload New PDF' : 'Click to Upload PDF'}
              </Button>
            </Upload>
          </Form.Item>

          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm space-y-1">
            <div><strong>Requirements:</strong></div>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Only PDF files are accepted</li>
              <li>Maximum file size is 50MB</li>
              {activeCatalogue ? (
                <li>Upload new PDF to replace the current catalog file</li>
              ) : (
                <li>PDF file is required for new catalog</li>
              )}
            </ul>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CatalogsPage;