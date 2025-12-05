'use client';

import React from 'react';
import { Layout } from 'antd';
import Sidebar from '@/app/components/Sidebar';

const { Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Content
          style={{
            padding: '24px',
            background: '#f5f5f5',
            minHeight: '100vh',
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
