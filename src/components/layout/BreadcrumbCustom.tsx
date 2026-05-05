'use client';

import React from 'react';
import { Breadcrumb } from 'antd';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { HomeOutlined } from '@ant-design/icons';

const breadcrumbNameMap: Record<string, string> = {
  '/': 'Dashboard',
  '/items': 'Items',
  '/suppliers': 'Suppliers',
  '/prices': 'Prices',
};

const BreadcrumbCustom: React.FC = () => {
  const pathname = usePathname();
  const pathSnippets = pathname.split('/').filter((i) => i);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return {
      key: url,
      title: <Link href={url}>{breadcrumbNameMap[url] || url}</Link>,
    };
  });

  const breadcrumbItems = [
    {
      title: (
        <Link href="/">
          <HomeOutlined />
          <span> Dashboard</span>
        </Link>
      ),
      key: 'home',
    },
    ...extraBreadcrumbItems,
  ];

  const finalItems = pathname === '/' ? [breadcrumbItems[0]] : breadcrumbItems;

  return (
    <Breadcrumb
      items={finalItems}
      style={{ margin: '8px 8px 0' }}
    />
  );
};

export default BreadcrumbCustom;
