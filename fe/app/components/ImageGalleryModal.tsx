'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, Upload, Spin, App } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { getImageArticles, uploadImageArticle, deleteImageArticle, type ImageArticle } from '@/app/lib/article-api';

interface ImageGalleryModalProps {
  open: boolean;
  onClose: () => void;
  onImageSelect: (imageUrl: string) => void;
  token: string;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ open, onClose, onImageSelect, token }) => {
  const { message } = App.useApp();
  const [images, setImages] = useState<ImageArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

  useEffect(() => {
    if (open) {
      loadImages();
    }
  }, [open]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await getImageArticles(token);
      setImages(data);
    } catch (error) {
      message.error('Failed to load images');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadImageArticle(formData, token);
      message.success('Image uploaded successfully');
      await loadImages();
    } catch (error) {
      message.error('Failed to upload image');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    try {
      await deleteImageArticle(id, imageUrl, token);
      message.success('Image deleted successfully');
      await loadImages();
    } catch (error) {
      message.error('Failed to delete image');
      console.error(error);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    onImageSelect(imageUrl);
    onClose();
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `${API_BASE}${url}`;
  };

  return (
    <Modal
      title="Content Image Gallery"
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      className="image-gallery-modal"
    >
      <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h4 className="text-md font-semibold mb-3">Upload New Image</h4>
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={(file) => {
            handleUpload(file);
            return false;
          }}
          disabled={uploading}
        >
          <Button icon={<UploadOutlined />} loading={uploading} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Select Image to Upload'}
          </Button>
        </Upload>
      </div>

      <Spin spinning={loading}>
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-2">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={getImageUrl(image.url)}
                  alt="Content"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-75 transition-opacity"
                  onClick={() => handleImageClick(getImageUrl(image.url))}
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTI0IDEyQzI3LjMxMzcgMTIgMzAgMTQuNjg2MyAzMCAxOEMzMCAyMS4zMTM3IDI3LjMxMzcgMjQgMjQgMjRDMjAuNjg2MyAyNCAxOCAyMS4zMTM3IDE4IDE4QzE4IDE0LjY4NjMgMjAuNjg2MyAxMiAyNCAxMloiIGZpbGw9IiM5QjlCQTAiLz4KPHBhdGggZD0iTTEyIDQwQzEyIDM0LjQ3NzIgMTYuNDc3MiAzMCAyMiAzMEgyNkMzMS41MjI4IDMwIDM2IDM0LjQ3NzIgMzYgNDBIMTJaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                  }}
                />
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="primary"
                    danger
                    size="small"
                    shape="circle"
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image.id, image.url);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No content images uploaded yet.</p>
            <p className="text-sm mt-2">Upload images to use them in your article content.</p>
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default ImageGalleryModal;
