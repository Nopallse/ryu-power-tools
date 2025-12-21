'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, Button, App } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import RichTextEditor, { type RichTextEditorRef } from '@/app/components/RichTextEditor';
import ImageGalleryModal from '@/app/components/ImageGalleryModal';
import { type Article, uploadImageArticle } from '@/app/lib/article-api';

const { TextArea } = Input;
const { Option } = Select;

interface ArticleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  article?: Article | null;
  loading: boolean;
  token: string;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ open, onClose, onSubmit, article, loading, token }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const editorRef = useRef<RichTextEditorRef>(null);

  const [contentHtml, setContentHtml] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [showImageGallery, setShowImageGallery] = useState(false);

  const isEdit = !!article;

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open && article) {
      // Edit mode - populate form
      form.setFieldsValue({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        author: article.author,
        status: article.status || 'DRAFT',
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
            url: `${API_BASE}${article.primaryImage}`,
          },
        ]);
      }
    } else if (open) {
      // Create mode - reset form
      form.resetFields();
      form.setFieldValue('status', 'DRAFT');
      setContentHtml('');
      setFileList([]);
    }
  }, [open, article, form]);

  const handleClose = () => {
    form.resetFields();
    setContentHtml('');
    setFileList([]);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!contentHtml || contentHtml.trim() === '') {
        message.error('Content is required');
        return;
      }

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

      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList.slice(-1));
  };

  // Handle image upload for content
  const handleContentImageUpload = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadImageArticle(formData, token);
      const imageUrl = `${API_BASE}${result.url}`;
      message.success('Image uploaded successfully');
      return imageUrl;
    } catch (error) {
      message.error('Failed to upload image');
      throw error;
    }
  };

  // Handle image selection from gallery
  const handleImageSelect = (imageUrl: string) => {
    editorRef.current?.insertImage(imageUrl);
  };

  return (
    <>
      <Modal
        title={isEdit ? 'Edit Article' : 'Add New Article'}
        open={open}
        onCancel={handleClose}
        onOk={handleSubmit}
        confirmLoading={loading}
        width={1000}
        okButtonProps={{ className: 'bg-green-600' }}
        okText={isEdit ? 'Update' : 'Create'}
        cancelText="Cancel"
        destroyOnHidden
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
            <Form.Item name="slug" label="Slug (optional)">
              <Input placeholder="article-slug (auto-generated if empty)" size="large" />
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

          <Form.Item label={<span>Content <span className="text-red-500">*</span></span>}>
            <div className="mb-2">
              <Button 
                type="default" 
                size="small"
                onClick={() => setShowImageGallery(true)}
              >
                📷 Insert Image from Gallery
              </Button>
            </div>
            <RichTextEditor
              ref={editorRef}
              value={contentHtml}
              onChange={setContentHtml}
              placeholder="Write your article content here..."
              onImageUpload={handleContentImageUpload}
              onImageButtonClick={() => setShowImageGallery(true)}
            />
          </Form.Item>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
            
            <Form.Item name="seoTitle" label="SEO Title">
              <Input placeholder="SEO title for search engines" />
            </Form.Item>

            <Form.Item name="seoDescription" label="SEO Description">
              <TextArea rows={2} placeholder="SEO description for search engines" />
            </Form.Item>
          </div>

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

      <ImageGalleryModal
        open={showImageGallery}
        onClose={() => setShowImageGallery(false)}
        onImageSelect={handleImageSelect}
        token={token}
      />
    </>
  );
};

export default ArticleForm;
