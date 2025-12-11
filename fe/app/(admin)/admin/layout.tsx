'use client';

import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  BookOutlined,
  TagsOutlined,
  FilePdfOutlined,
  ShopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems: MenuProps['items'] = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: 'products',
      icon: <AppstoreOutlined />,
      label: 'Products',
      children: [
        {
          key: '/admin/products',
          label: <Link href="/admin/products">All Products</Link>,
        },
        {
          key: '/admin/products/featured',
          label: <Link href="/admin/products/featured">Featured Products</Link>,
        },
        {
          key: '/admin/products/latest',
          label: <Link href="/admin/products/latest">Latest Products</Link>,
        },
      ],
    },
    {
      key: 'categories',
      icon: <TagsOutlined />,
      label: 'Categories',
      children: [
        {
          key: '/admin/categories',
          label: <Link href="/admin/categories">All Categories</Link>,
        },
        {
          key: '/admin/categories/subcategories',
          label: <Link href="/admin/categories/subcategories">Subcategories</Link>,
        },
      ],
    },
    {
      key: '/admin/blog',
      icon: <BookOutlined />,
      label: <Link href="/admin/blog">Blog & Articles</Link>,
    },
    {
      key: '/admin/news',
      icon: <FileTextOutlined />,
      label: <Link href="/admin/news">News & Articles</Link>,
    },
    {
      key: '/admin/catalogs',
      icon: <FilePdfOutlined />,
      label: <Link href="/admin/catalogs">Catalogs</Link>,
    },
    {
      key: '/admin/service-centers',
      icon: <ShopOutlined />,
      label: <Link href="/admin/service-centers">Service Centers</Link>,
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const getSelectedKey = () => {
    if (pathname.startsWith('/admin/products')) return pathname;
    if (pathname.startsWith('/admin/categories')) return pathname;
    return pathname;
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="!bg-white border-r border-gray-200"
        width={260}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
          {!collapsed ? (
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="font-bold text-lg text-gray-900">RYU Admin</span>
            </Link>
          ) : (
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          defaultOpenKeys={['products', 'categories']}
          items={menuItems}
          className="border-0 !bg-white mt-4"
          style={{
            fontSize: '14px',
          }}
        />
      </Sider>

      <Layout>
        <Header className="!bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-xl text-gray-700 hover:text-gray-900 transition-colors"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className="cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
              <Avatar icon={<UserOutlined />} className="bg-green-600" />
              <div className="hidden md:block">
                <Text className="text-sm font-medium text-gray-900">Admin User</Text>
              </div>
            </Space>
          </Dropdown>
        </Header>

        <Content className="m-6 p-6 bg-gray-50 rounded-lg min-h-[calc(100vh-88px)]">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
