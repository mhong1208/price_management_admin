'use client';

import React from 'react';
import { Layout, Button, Avatar, Dropdown, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  return (
    <AntHeader style={{ background: '#fff', padding: 0, paddingRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'between', boxShadow: '0 1px 4px rgba(0,21,41,.08)', position: 'sticky', top: 0, zIndex: 10 }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        style={{ width: '64px', height: '64px', fontSize: '18px' }}
      />

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <Space style={{ cursor: 'pointer', padding: '0 8px', borderRadius: '4px', transition: 'background 0.3s' }}>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#f2a900' }} />
            <span style={{ fontWeight: 500, color: '#434343' }}>Admin</span>
          </Space>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;
