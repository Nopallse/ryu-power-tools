import React from 'react';
import { Layout } from 'antd';
import Navbar from '@/app/components/Navbar';

const { Content, Footer } = Layout;

export default function LandingLayout({
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
        © 2025 Ryu Power Tools. All rights reserved.
      </Footer>
    </Layout>
  );
}
