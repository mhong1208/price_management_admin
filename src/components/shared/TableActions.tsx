import React from 'react';
import { Space, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, SaveOutlined, HistoryOutlined } from '@ant-design/icons';

interface TableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onSave?: () => void;
  onHistory?: () => void;
  editTooltip?: string;
  deleteTooltip?: string;
  viewTooltip?: string;
  saveTooltip?: string;
  historyTooltip?: string;
  isSaving?: boolean;
}

const TableActions: React.FC<TableActionsProps> = ({
  onEdit,
  onDelete,
  onView,
  onSave,
  onHistory,
  editTooltip = 'Edit',
  deleteTooltip = 'Delete',
  viewTooltip = 'View Details',
  saveTooltip = 'Save Changes',
  historyTooltip = 'Price History',
  isSaving = false,
}) => {
  return (
    <Space size="small">
      {onView && (
        <Tooltip title={viewTooltip}>
          <Button
            type="text"
            size="small"
            style={{
              backgroundColor: '#e6f7ff',
              color: '#1890ff',
              borderRadius: '4px'
            }}
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
          />
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip title={editTooltip}>
          <Button
            type="text"
            size="small"
            style={{
              backgroundColor: 'var(--primary-light, #fff7e6)',
              color: 'var(--primary-color, #f2a900)',
              borderRadius: '4px'
            }}
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          />
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip title={deleteTooltip}>
          <Button
            type="text"
            size="small"
            style={{
              backgroundColor: '#fff1f0',
              color: '#ff4d4f',
              borderRadius: '4px'
            }}
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          />
        </Tooltip>
      )}
      {onSave && (
        <Tooltip title={saveTooltip}>
          <Button
            type="text"
            size="small"
            style={{
              backgroundColor: '#f6ffed',
              color: '#52c41a',
              borderRadius: '4px'
            }}
            icon={<SaveOutlined />}
            loading={isSaving}
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
          />
        </Tooltip>
      )}
      {onHistory && (
        <Tooltip title={historyTooltip}>
          <Button
            type="text"
            size="small"
            style={{
              backgroundColor: '#f9f0ff',
              color: '#722ed1',
              borderRadius: '4px'
            }}
            icon={<HistoryOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onHistory();
            }}
          />
        </Tooltip>
      )}
    </Space>
  );
};

export default TableActions;
