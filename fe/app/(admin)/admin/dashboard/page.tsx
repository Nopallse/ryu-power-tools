'use client';

import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Space, Button } from 'antd';
import {
  AppstoreOutlined,
  FileTextOutlined,
  BookOutlined,
  ShopOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface RecentActivity {
  key: string;
  type: string;
  title: string;
  status: string;
  date: string;
}

const DashboardPage = () => {
  const recentActivities: RecentActivity[] = [
    {
      key: '1',
      type: 'Product',
      title: 'Angle Grinder RYU-AG100',
      status: 'published',
      date: '2025-12-11',
    },
    {
      key: '2',
      type: 'Blog',
      title: 'Tips Memilih Power Tools',
      status: 'draft',
      date: '2025-12-10',
    },
    {
      key: '3',
      type: 'News',
      title: 'Promo Akhir Tahun 2025',
      status: 'published',
      date: '2025-12-09',
    },
  ];

  const columns: ColumnsType<RecentActivity> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Product' ? 'blue' : type === 'Blog' ? 'green' : 'orange'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
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
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium">Total Products</span>}
              value={156}
              prefix={<AppstoreOutlined className="text-blue-600" />}
              valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 600 }}
              suffix={
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <ArrowUpOutlined /> 12%
                </span>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium">Blog Posts</span>}
              value={43}
              prefix={<BookOutlined className="text-green-600" />}
              valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 600 }}
              suffix={
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <ArrowUpOutlined /> 8%
                </span>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium">News Articles</span>}
              value={28}
              prefix={<FileTextOutlined className="text-orange-600" />}
              valueStyle={{ color: '#fa8c16', fontSize: '28px', fontWeight: 600 }}
              suffix={
                <span className="text-sm text-red-600 flex items-center gap-1">
                  <ArrowDownOutlined /> 3%
                </span>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-600 font-medium">Service Centers</span>}
              value={12}
              prefix={<ShopOutlined className="text-purple-600" />}
              valueStyle={{ color: '#722ed1', fontSize: '28px', fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={<span className="font-semibold text-gray-900">Recent Activities</span>}
            bordered={false}
            className="shadow-sm"
          >
            <Table
              columns={columns}
              dataSource={recentActivities}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={<span className="font-semibold text-gray-900">Quick Actions</span>}
            bordered={false}
            className="shadow-sm"
          >
            <Space direction="vertical" className="w-full" size="middle">
              <Button type="primary" block size="large" className="bg-green-600 hover:bg-green-700">
                Add New Product
              </Button>
              <Button block size="large">
                Create Blog Post
              </Button>
              <Button block size="large">
                Add News Article
              </Button>
              <Button block size="large">
                Manage Categories
              </Button>
            </Space>
          </Card>

          <Card
            title={<span className="font-semibold text-gray-900">System Status</span>}
            bordered={false}
            className="shadow-sm mt-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Storage Used</span>
                <span className="font-semibold text-gray-900">2.3 GB / 10 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '23%' }}></div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-600">Database</span>
                <Tag color="success">Connected</Tag>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Backup</span>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
