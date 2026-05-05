'use client';

import React, { useState } from 'react';
import { Layout, ConfigProvider, App } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Sidebar from './Sidebar';
import Header from './Header';
import BreadcrumbCustom from './BreadcrumbCustom';
import viVN from 'antd/locale/vi_VN';

const { Content } = Layout;

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AntdRegistry>
      <ConfigProvider
        locale={viVN}
        theme={{
          token: {
            colorPrimary: '#f2a900',
            borderRadius: 6,
          },
        }}
      >
        <App>
          <Layout className="min-h-screen">
            <Sidebar collapsed={collapsed} />
            <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
              <Header
                collapsed={collapsed}
                onToggle={() => setCollapsed(!collapsed)}
              />
              <BreadcrumbCustom />
              <Content className="admin-content-wrapper">
                {children}
              </Content>
            </Layout>
          </Layout>
        </App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
