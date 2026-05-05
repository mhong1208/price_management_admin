'use client';

import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  DatabaseOutlined,
  DollarOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { APP_ROUTES } from '@/constants/app-constants';

const { Sider } = Layout;

const Sidebar: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      key: APP_ROUTES.DASHBOARD,
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: APP_ROUTES.ITEMS,
      icon: <DatabaseOutlined />,
      label: 'Item Management',
    },
    {
      key: APP_ROUTES.SUPPLIERS,
      icon: <ShopOutlined />,
      label: 'Supplier Management',
    },
    {
      key: APP_ROUTES.PRICES,
      icon: <DollarOutlined />,
      label: 'Price Management',
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme="light"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
        zIndex: 1000,
      }}
    >
      <div className="sidebar-logo">
        <h1>
          {collapsed ? 'PM' : 'Price Management'}
        </h1>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        style={{ border: 'none', marginTop: '8px' }}
      />
    </Sider>
  );
};

export default Sidebar;
