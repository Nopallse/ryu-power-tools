'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Popconfirm,
  Card,
  Spin,
  Upload,
  Tag,
  Image,
  TreeSelect,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  LoadingOutlined,
  ShoppingOutlined,
  LinkOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { getProducts, createProduct, updateProduct, deleteProduct, type Product, type ProductImage } from '@/app/lib/product-api';
import { getCategoryTree, type TreeSelectNode } from '@/app/lib/category-api';
import { useAuthGuard } from '@/app/hooks/useAuthGuard';
import { App } from 'antd';

const { TextArea } = Input;

const ProductsPage = () => {
  const { auth, ready } = useAuthGuard();
  const { message } = App.useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categoryTree, setCategoryTree] = useState<TreeSelectNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!ready || !auth) return;
    loadProducts();
  }, [ready, auth]);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.id.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchText, products]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const [data, tree] = await Promise.all([
        getProducts(auth!.token),
        getCategoryTree(auth!.token),
      ]);
      const list = Array.isArray(data) ? data : [];
      setProducts(list);
      setFilteredProducts(list);
      setCategoryTree(Array.isArray(tree) ? tree : []);
    } catch (error) {
      message.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      // Extract category IDs from productCategory
      const categoryIds = product.productCategory?.map((cat) => cat.categoryId) || [];
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        storeUrl: product.storeUrl,
        categoryIds: categoryIds,
      });
      // Set existing images from the product
      setExistingImages(product.productImages || []);
      setFileList([]);
    } else {
      setEditingId(null);
      form.resetFields();
      setExistingImages([]);
      setFileList([]);
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    form.resetFields();
    setFileList([]);
    setExistingImages([]);
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImages(existingImages.filter(img => img.url !== imageUrl));
  };

  const handleOk = async () => {
    try {
      if (!auth || !auth.token) {
        message.error('Not authenticated');
        return;
      }

      const values = await form.validateFields();
      setSubmitting(true);

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description || '');
      formData.append('storeUrl', values.storeUrl || '');

      // Add category IDs to formData
      if (values.categoryIds && values.categoryIds.length > 0) {
        values.categoryIds.forEach((categoryId: string) => {
          formData.append('categoryIds', categoryId);
        });
      }

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('files', file.originFileObj);
        }
      });

      if (editingId) {
        await updateProduct(editingId, formData, auth.token);
        message.success('Product updated successfully');
      } else {
        await createProduct(formData, auth.token);
        message.success('Product created successfully');
      }

      setIsModalOpen(false);
      setEditingId(null);
      form.resetFields();
      setFileList([]);
      loadProducts();
    } catch (error) {
      message.error(editingId ? 'Failed to update product' : 'Failed to create product');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id, auth!.token);
      message.success('Product deleted successfully');
      loadProducts();
    } catch (error) {
      message.error('Failed to delete product');
      console.error(error);
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <ShoppingOutlined className="text-blue-500" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Categories',
      dataIndex: 'productCategory',
      key: 'categories',
      width: 280,
      render: (categories: any[]) => (
        <div className="flex flex-col gap-1">
          {categories?.length > 0 ? (
            categories.map((cat) => (
              <Tag key={cat.categoryId} color="blue" className="w-fit">
                {cat.category.name}
              </Tag>
            ))
          ) : (
            <span className="text-gray-400">No categories</span>
          )}
        </div>
      ),
    },
    {
      title: 'Images',
      dataIndex: 'productImages',
      key: 'images',
      width: 100,
      render: (images: any[]) => (
        <Tag color={images?.length > 0 ? 'green' : 'default'}>
          {images?.length || 0} image(s)
        </Tag>
      ),
    },
    {
      title: 'Store URL',
      dataIndex: 'storeUrl',
      key: 'storeUrl',
      width: 120,
      render: (url: string) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
            <LinkOutlined />
            <span>View</span>
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        ),
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
            title="Delete Product"
            description="Are you sure you want to delete this product?"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Manage product catalog and information</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => showModal()}
          className="bg-green-600 hover:bg-green-700"
        >
          Add Product
        </Button>
      </div>

      <Card variant="borderless" className="shadow-sm">
        <div className="mb-4">
          <Input
            placeholder="Search products..."
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
            dataSource={Array.isArray(filteredProducts) ? filteredProducts : []}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total ${total} products`,
            }}
            scroll={{ x: 1000 }}
          />
        </Spin>
      </Card>

      <Modal
        title={editingId ? 'Edit Product' : 'Add Product'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={submitting}
        width={700}
        okButtonProps={{ className: 'bg-green-600' }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input placeholder="e.g., Power Distribution Unit 16A" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea
              rows={4}
              placeholder="Enter product description..."
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="storeUrl"
            label="Store URL"
            rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
          >
            <Input
              prefix={<LinkOutlined />}
              placeholder="https://store.example.com/product"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="categoryIds"
            label="Categories"
          >
            <TreeSelect
              treeData={categoryTree}
              placeholder="Select categories"
              allowClear
              multiple
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_ALL}
              treeDefaultExpandAll
              size="large"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label="Product Images">
            {/* Display existing images when editing */}
            {editingId && existingImages.length > 0 && (
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Current Images:</div>
                <div className="grid grid-cols-4 gap-3">
                  {existingImages.map((img, index) => (
                    <div key={index} className="relative w-full" style={{ paddingBottom: '100%' }}>
                      <Image
                        src={img.url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                        preview={true}
                      />
                      <Button
                        type="primary"
                        danger
                        size="small"
                        icon={<CloseCircleOutlined />}
                        onClick={() => handleRemoveExistingImage(img.url)}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          zIndex: 10,
                        }}
                        title="Remove image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload new images */}
            <div>
              <div className="text-sm text-gray-600 mb-2">
                {editingId ? 'Add New Images:' : 'Upload Images:'}
              </div>
              <Upload
                listType="picture"
                multiple
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} size="large">
                  {editingId ? 'Add More Images' : 'Select Images'}
                </Button>
              </Upload>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
