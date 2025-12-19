'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Space, Button, Spin, Empty, Progress } from 'antd';
import {
  ShoppingOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  ShopOutlined,
  ArrowUpOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAuthGuard } from '@/app/hooks/useAuthGuard';
import { getProducts, type Product } from '@/app/lib/product-api';
import { getCategories, type Category } from '@/app/lib/category-api';
import { getArticles, type Article } from '@/app/lib/article-api';
import { getCatalogues, type Catalogue } from '@/app/lib/catalogue-api';
import { getServiceCenters, type ServiceCenter } from '@/app/lib/service-center-api';
import { App } from 'antd';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface DashboardStats {
  products: number;
  categories: number;
  articles: number;
  catalogues: number;
  serviceCenters: number;
}

interface RecentItem {
  key: string;
  type: 'Product' | 'Category' | 'Article' | 'Catalogue' | 'Service Center';
  title: string;
  date: string;
}

const DashboardPage = () => {
  const { auth, ready } = useAuthGuard();
  const { message } = App.useApp();

  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    categories: 0,
    articles: 0,
    catalogues: 0,
    serviceCenters: 0,
  });

  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ready || !auth) return;
    loadDashboardData();
  }, [ready, auth]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [products, categories, articles, catalogues, serviceCenters] = await Promise.all([
        getProducts(auth!.token),
        getCategories(auth!.token),
        getArticles(auth!.token),
        getCatalogues(auth!.token),
        getServiceCenters(auth!.token),
      ]);

      // Update stats
      const productList = Array.isArray(products) ? products : [];
      const categoriesList = Array.isArray(categories) ? categories : [];
      const articlesList = Array.isArray(articles) ? articles : [];
      const cataloguesList = Array.isArray(catalogues) ? catalogues : [];
      const serviceCentersList = Array.isArray(serviceCenters) ? serviceCenters : [];

      setStats({
        products: productList.length,
        categories: categoriesList.length,
        articles: articlesList.length,
        catalogues: cataloguesList.length,
        serviceCenters: serviceCentersList.length,
      });

      // Prepare recent items (get 5 most recent)
      const allItems: RecentItem[] = [];

      productList.slice(0, 3).forEach((item: Product) => {
        allItems.push({
          key: `product-${item.id}`,
          type: 'Product',
          title: item.name,
          date: item.updatedAt || item.createdAt || new Date().toISOString(),
        });
      });

      articlesList.slice(0, 2).forEach((item: Article) => {
        allItems.push({
          key: `article-${item.id}`,
          type: 'Article',
          title: item.title,
          date: item.updatedAt || item.createdAt || new Date().toISOString(),
        });
      });

      cataloguesList.slice(0, 2).forEach((item: Catalogue) => {
        allItems.push({
          key: `catalogue-${item.id}`,
          type: 'Catalogue',
          title: item.name || item.title || 'Untitled Catalogue',
          date: item.updatedAt || item.createdAt || new Date().toISOString(),
        });
      });

      // Sort by date and take first 5
      const sorted = allItems.sort((a, b) => 
        dayjs(b.date).diff(dayjs(a.date))
      ).slice(0, 5);

      setRecentItems(sorted);
    } catch (error) {
      message.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<RecentItem> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          'Product': 'blue',
          'Category': 'cyan',
          'Article': 'green',
          'Catalogue': 'orange',
          'Service Center': 'purple',
        };
        return <Tag color={colorMap[type] || 'default'}>{type}</Tag>;
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Last Updated',
      dataIndex: 'date',
      key: 'date',
      width: 150,
      render: (date: string) => <span className="text-gray-600 text-sm">{dayjs(date).fromNow()}</span>,
    },
  ];

  if (!ready) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your RYU Power Tools admin panel.</p>
      </div>

      <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} />}>
        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title={<span className="text-gray-600 font-medium">Total Products</span>}
                value={stats.products}
                prefix={<ShoppingOutlined className="text-blue-600" />}
                valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 600 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title={<span className="text-gray-600 font-medium">Categories</span>}
                value={stats.categories}
                prefix={<AppstoreOutlined className="text-cyan-600" />}
                valueStyle={{ color: '#13c2c2', fontSize: '28px', fontWeight: 600 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title={<span className="text-gray-600 font-medium">Blog Posts</span>}
                value={stats.articles}
                prefix={<FileTextOutlined className="text-green-600" />}
                valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 600 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title={<span className="text-gray-600 font-medium">Catalogues</span>}
                value={stats.catalogues}
                prefix={<FilePdfOutlined className="text-orange-600" />}
                valueStyle={{ color: '#fa8c16', fontSize: '28px', fontWeight: 600 }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title={<span className="text-gray-600 font-medium">Service Centers</span>}
                value={stats.serviceCenters}
                prefix={<ShopOutlined className="text-purple-600" />}
                valueStyle={{ color: '#722ed1', fontSize: '28px', fontWeight: 600 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Recent Activities and Quick Actions */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card
              title={<span className="font-semibold text-gray-900">Recent Activities</span>}
              bordered={false}
              className="shadow-sm"
            >
              {recentItems.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={recentItems}
                  pagination={false}
                  size="small"
                />
              ) : (
                <Empty
                  description="No recent activities"
                  style={{ marginTop: '40px', marginBottom: '40px' }}
                />
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            {/* Quick Actions */}
            

            {/* Content Distribution */}
            <Card
              title={<span className="font-semibold text-gray-900">Content Distribution</span>}
              bordered={false}
              className="shadow-sm"
            >
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Products</span>
                    <span className="font-semibold">{stats.products}</span>
                  </div>
                  <Progress
                    percent={stats.products > 0 ? Math.min((stats.products / 200) * 100, 100) : 0}
                    strokeColor="#1890ff"
                    size="small"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Categories</span>
                    <span className="font-semibold">{stats.categories}</span>
                  </div>
                  <Progress
                    percent={stats.categories > 0 ? Math.min((stats.categories / 50) * 100, 100) : 0}
                    strokeColor="#13c2c2"
                    size="small"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Articles</span>
                    <span className="font-semibold">{stats.articles}</span>
                  </div>
                  <Progress
                    percent={stats.articles > 0 ? Math.min((stats.articles / 100) * 100, 100) : 0}
                    strokeColor="#52c41a"
                    size="small"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Catalogues</span>
                    <span className="font-semibold">{stats.catalogues}</span>
                  </div>
                  <Progress
                    percent={stats.catalogues > 0 ? Math.min((stats.catalogues / 50) * 100, 100) : 0}
                    strokeColor="#fa8c16"
                    size="small"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Service Centers</span>
                    <span className="font-semibold">{stats.serviceCenters}</span>
                  </div>
                  <Progress
                    percent={stats.serviceCenters > 0 ? Math.min((stats.serviceCenters / 50) * 100, 100) : 0}
                    strokeColor="#722ed1"
                    size="small"
                  />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default DashboardPage;
