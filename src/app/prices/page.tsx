'use client';

import React from 'react';
import { Typography, Empty } from 'antd';

const { Title } = Typography;

const PricesPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <Title level={2}>Quản lý Giá</Title>
      <div className="bg-white p-12 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
        <Empty 
          description="Tính năng Quản lý Giá đang được phát triển" 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      </div>
    </div>
  );
};

export default PricesPage;
