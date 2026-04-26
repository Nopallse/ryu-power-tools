'use client';

import { useEffect, useState } from 'react';
import { Card, Descriptions, Button, Space, Tag } from 'antd';
import { getStoredAuth, setStoredAuth } from '@/app/lib/auth-client';

export default function DebugAuthPage() {
  const [auth, setAuth] = useState<any>(null);
  const [storageContent, setStorageContent] = useState<string>('');

  const checkAuth = () => {
    const stored = getStoredAuth();
    setAuth(stored);
    console.log('Stored auth:', stored);
  };

  const checkStorage = () => {
    const raw = window.localStorage.getItem('ryu-auth');
    setStorageContent(raw || 'No ryu-auth key found');
  };

  useEffect(() => {
    checkAuth();
    checkStorage();
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Auth Debug Page</h1>
      
      <Space direction="vertical" style={{ width: '100%', gap: '20px' }}>
        <div>
          <h2>Stored Auth Object</h2>
          <Card>
            {auth ? (
              <Descriptions column={1} bordered>
                <Descriptions.Item label="ID">{auth.id}</Descriptions.Item>
                <Descriptions.Item label="Email">{auth.email}</Descriptions.Item>
                <Descriptions.Item label="Name">{auth.name}</Descriptions.Item>
                <Descriptions.Item label="Token">
                  <Tag color={auth.token ? 'green' : 'red'}>
                    {auth.token ? `${auth.token.substring(0, 20)}...` : 'MISSING'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Token Length">
                  {auth.token ? auth.token.length : 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <p>No auth data found</p>
            )}
          </Card>
        </div>

        <div>
          <h2>Raw localStorage Content</h2>
          <Card>
            <pre style={{ maxHeight: '300px', overflow: 'auto' }}>
              {storageContent}
            </pre>
          </Card>
        </div>

        <div>
          <Space>
            <Button type="primary" onClick={checkAuth}>
              Refresh Auth Check
            </Button>
            <Button type="primary" onClick={checkStorage}>
              Refresh Storage Check
            </Button>
          </Space>
        </div>

        <div>
          <h2>localStorage Keys</h2>
          <Card>
            <ul>
              {Object.keys(window.localStorage).map((key) => (
                <li key={key}>
                  {key} = {window.localStorage.getItem(key)?.substring(0, 50)}...
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Space>
    </div>
  );
}
