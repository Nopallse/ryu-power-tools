'use client';

import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.css';

const { Sider } = Layout;

interface SidebarProps {
  onMenuClick?: (key: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuClick }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      href: '/admin/dashboard',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
      href: '/admin/users',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      href: '/admin/settings',
    },
  ];

  const getSelectedKey = () => {
    const key = menuItems.find((item) => pathname.includes(item.href))?.key;
    return key || 'dashboard';
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className={styles.sidebar}
      width={250}
      collapsedWidth={80}
    >
      <div className={styles.logoContainer}>
        <div className={styles.logo}>{collapsed ? 'RP' : 'Ryu Power'}</div>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: <Link href={item.href}>{item.label}</Link>,
        }))}
        onClick={(e) => onMenuClick?.(e.key)}
        className={styles.menu}
      />

      <div className={styles.footer}>
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          block
          className={styles.logoutBtn}
        >
          {!collapsed && 'Logout'}
        </Button>
      </div>

      <button
        className={styles.collapseBtn}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </button>
    </Sider>
  );
};

export default Sidebar;
