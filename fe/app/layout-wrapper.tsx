'use client';

import React from 'react';
import { Layout } from 'antd';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

const { Content } = Layout;

export default function LayoutWrapperComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <Navbar />
      <Content className="landing-content">
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ryu Power Tools © 2024. All Rights Reserved.
      </Footer>
    </Layout>
  );
}
