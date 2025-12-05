'use client';

import React from 'react';
import { Layout } from 'antd';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

const { Content } = Layout;

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Content style={{ flex: 1 }}>
        {children}
      </Content>
      <Footer />
    </Layout>
  );
}
