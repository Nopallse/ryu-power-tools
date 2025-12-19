'use client';

import React, { useCallback, useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Spin, App } from 'antd';
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
import { usePathname, useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';
import { useAuthGuard } from '@/app/hooks/useAuthGuard';
import { logout } from '@/app/lib/auth-client';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { auth, ready } = useAuthGuard();
  const { message } = App.useApp();

  const menuItems: MenuProps['items'] = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: '/admin/products',
      icon: <AppstoreOutlined />,
      label: <Link href="/admin/products">Products</Link>,
    },
    {
      key: '/admin/categories',
      icon: <TagsOutlined />,
      label: <Link href="/admin/categories">Categories</Link>,
    },
    {
      key: '/admin/blog',
      icon: <FileTextOutlined />,
      label: <Link href="/admin/blog">Blog & Articles</Link>,
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

  const handleUserMenuClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'logout') {
      const hide = message.loading('Logging out...');
      await logout();
      hide();
      message.success('Logged out');
      router.replace('/login');
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!auth) return null;

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

          <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
            <Space className="cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
              <Avatar icon={<UserOutlined />} className="bg-green-600" />
              <div className="hidden md:block">
                <Text className="text-sm font-medium text-gray-900">{auth?.email}</Text>
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
