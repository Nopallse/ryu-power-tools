'use client';

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, FileOutlined, TeamOutlined } from '@ant-design/icons';

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Dashboard</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={1234}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Projects"
              value={56}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Members"
              value={892}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={123456}
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '24px' }}>
        <h3>Recent Activity</h3>
        <p>Activity logs will be displayed here</p>
      </Card>
    </div>
  );
}
