'use client';

import React, { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Modal,
  Form,
  Upload,
  message,
  Divider,
  Empty,
  Statistic,
  Tag,
  Input,
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileOutlined,
  CalendarOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';

interface CatalogFile {
  fileName: string;
  fileSize: string;
  downloads: number;
  uploadDate: string;
  description: string;
}

const CatalogsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [catalogFile, setCatalogFile] = useState<CatalogFile | null>({
    fileName: 'Product-Catalog-2025.pdf',
    fileSize: '12.5 MB',
    downloads: 456,
    uploadDate: '2025-01-10',
    description: 'Katalog produk lengkap RYU Power Tools tahun 2025 dengan spesifikasi dan harga',
  });

  const handleUpload = () => {
    form.validateFields().then(() => {
      message.success('Catalog file updated successfully');
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Delete Catalog',
      content: 'Are you sure you want to delete the catalog file? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setCatalogFile(null);
        message.success('Catalog file deleted');
      },
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Catalog</h1>
        <p className="text-gray-600">Manage the main product catalog PDF file for download</p>
      </div>

      {catalogFile ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Catalog Card */}
          <div className="lg:col-span-2">
            <Card
              bordered={false}
              className="shadow-sm"
              title={
                <div className="flex items-center gap-2">
                  <FileOutlined className="text-blue-500 text-lg" />
                  <span>Current Catalog</span>
                </div>
              }
            >
              <div className="space-y-4">
                {/* File Preview */}
                <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <div className="text-4xl text-blue-500 mb-3">
                      <FileOutlined />
                    </div>
                    <div className="font-semibold text-gray-900 text-lg mb-1">
                      {catalogFile.fileName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {catalogFile.fileSize}
                    </div>
                  </div>
                </div>

                <Divider />

                {/* File Description */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Description
                  </label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">
                    {catalogFile.description}
                  </p>
                </div>

                {/* File Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Upload Date</div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <CalendarOutlined />
                        {catalogFile.uploadDate}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Total Downloads</div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <DownloadOutlined />
                        {catalogFile.downloads.toLocaleString()} times
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    size="large"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Download Catalog
                  </Button>
                  <Button
                    icon={<EditOutlined />}
                    size="large"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    size="large"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            <Card bordered={false} className="shadow-sm">
              <Statistic
                title="Total Downloads"
                value={catalogFile.downloads}
                prefix={<DownloadOutlined />}
                valueStyle={{ color: '#2d6a2e' }}
              />
            </Card>

            <Card bordered={false} className="shadow-sm">
              <Statistic
                title="File Size"
                value={catalogFile.fileSize}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>

            <Card bordered={false} className="shadow-sm">
              <div>
                <div className="text-xs text-gray-600 mb-2">Status</div>
                <Tag color="success" className="text-sm px-3 py-1">
                  Published
                </Tag>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card bordered={false} className="shadow-sm text-center py-12">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No catalog file uploaded yet"
            style={{ marginBottom: 24 }}
          >
            <Button
              type="primary"
              size="large"
              icon={<CloudUploadOutlined />}
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Upload First Catalog
            </Button>
          </Empty>
        </Card>
      )}

      {/* Upload/Edit Modal */}
      <Modal
        title={catalogFile ? 'Edit Catalog' : 'Upload New Catalog'}
        open={isModalOpen}
        onOk={handleUpload}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={600}
        okButtonProps={{ className: 'bg-green-600' }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="description"
            label="Catalog Description"
            rules={[{ required: true, message: 'Please enter description' }]}
            initialValue={catalogFile?.description}
          >
            <Input.TextArea
              rows={3}
              placeholder="Describe what's included in this catalog..."
            />
          </Form.Item>

          <Form.Item
            name="catalogFile"
            label="Catalog File (PDF)"
            rules={[{ required: true, message: 'Please upload PDF file' }]}
          >
            <Upload
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
            <strong>Note:</strong> Only one catalog file can be stored. Uploading a new file will replace the current one.
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CatalogsPage;
