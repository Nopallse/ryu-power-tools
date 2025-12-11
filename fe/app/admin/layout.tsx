'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  DownloadOutlined,
  CustomerServiceOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header, Sider, Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link href="/admin">Dashboard</Link>,
    },
    {
      key: '/admin/products',
      icon: <ShoppingOutlined />,
      label: 'Products',
      children: [
        {
          key: '/admin/products',
          label: <Link href="/admin/products">All Products</Link>,
        },
        {
          key: '/admin/products/new',
          label: <Link href="/admin/products/new">Add New</Link>,
        },
        {
          key: '/admin/products/featured',
          label: <Link href="/admin/products/featured">Featured Products</Link>,
        },
      ],
    },
    {
      key: '/admin/categories',
      icon: <AppstoreOutlined />,
      label: 'Categories',
      children: [
        {
          key: '/admin/categories',
          label: <Link href="/admin/categories">All Categories</Link>,
        },
        {
          key: '/admin/categories/new',
          label: <Link href="/admin/categories/new">Add New</Link>,
        },
      ],
    },
    {
      key: '/admin/blog',
      icon: <FileTextOutlined />,
      label: 'Blog',
      children: [
        {
          key: '/admin/blog',
          label: <Link href="/admin/blog">All Articles</Link>,
        },
        {
          key: '/admin/blog/new',
          label: <Link href="/admin/blog/new">Add New</Link>,
        },
      ],
    },
    {
      key: '/admin/catalogs',
      icon: <DownloadOutlined />,
      label: <Link href="/admin/catalogs">Catalogs</Link>,
    },
    {
      key: '/admin/service-centers',
      icon: <CustomerServiceOutlined />,
      label: <Link href="/admin/service-centers">Service Centers</Link>,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="bg-[#001529]"
        width={250}
      >
        <div className="h-16 flex items-center justify-center text-white text-xl font-bold border-b border-white/10">
          {!collapsed ? 'RYU Admin' : 'RYU'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          defaultOpenKeys={['/admin/products', '/admin/categories', '/admin/blog']}
          items={menuItems}
          className="bg-[#001529]"
        />
      </Sider>
      <Layout>
        <Header className="bg-white px-6 flex items-center justify-between shadow-sm">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg w-16 h-16"
          />
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank">
              <Button type="link">View Site</Button>
            </Link>
            <Button type="text" icon={<LogoutOutlined />}>
              Logout
            </Button>
          </div>
        </Header>
        <Content className="m-6 p-6 bg-white rounded-lg min-h-[calc(100vh-112px)]">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
