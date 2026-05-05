'use client';

import React from 'react';
import { Tag } from 'antd';

interface CustomTagProps {
  type: 'status' | 'category' | 'default';
  value: string;
  color?: string;
}

const CustomTag: React.FC<CustomTagProps> = ({ type, value, color }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'hoạt động':
        return 'success';
      case 'inactive':
      case 'ngừng':
        return 'error';
      case 'pending':
      case 'chờ':
        return 'warning';
      default:
        return 'default';
    }
  };

  const displayColor = color || (type === 'status' ? getStatusColor(value) : 'gold');

  return (
    <Tag color={displayColor} style={{ textTransform: 'capitalize', padding: '0 12px', borderRadius: '16px', fontWeight: 500 }}>
      {value}
    </Tag>
  );
};

export default CustomTag;
