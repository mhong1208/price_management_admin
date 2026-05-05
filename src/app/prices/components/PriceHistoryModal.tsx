import { Modal, Table, Tag, Typography, Space } from 'antd';
import { formatDateVN, formatDateTimeVN } from '@/utils/date-utils';
import { PriceHistory, priceService } from '@/services/price-service';
import { useEffect, useState } from 'react';

const { Text } = Typography;

interface PriceHistoryModalProps {
  open: boolean;
  onCancel: () => void;
  itemId?: string;
  supplierId?: string;
  itemName?: string;
  supplierName?: string;
}

const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({
  open,
  onCancel,
  itemId,
  supplierId,
  itemName,
  supplierName,
}) => {
  const [history, setHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && itemId && supplierId) {
      fetchHistory();
    }
  }, [open, itemId, supplierId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await priceService.getPriceHistory(itemId!, supplierId!);
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch price history', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Ngày hiệu lực',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
    },
    {
      title: 'Giá cũ',
      dataIndex: 'oldPrice',
      key: 'oldPrice',
      render: (price: number) => (
        <Text delete type="secondary">
          {new Intl.NumberFormat().format(price)}
        </Text>
      ),
    },
    {
      title: 'Giá mới',
      dataIndex: 'newPrice',
      key: 'newPrice',
      render: (price: number, record: PriceHistory) => (
        <Text strong type="success">
          {new Intl.NumberFormat().format(price)} {record.currency}
        </Text>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => (
        <Tag color={action === 'CREATE' ? 'blue' : 'orange'}>
          {action}
        </Tag>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
    {
      title: 'Thời gian cập nhật',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDateTimeVN(date),
    },
  ];

  return (
    <Modal
      title={
        <Space orientation="vertical" size={0}>
          <Text strong style={{ fontSize: '16px' }}>Lịch sử thay đổi giá</Text>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            {itemName} | {supplierName}
          </Text>
        </Space>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <Table
        dataSource={history}
        columns={columns}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={{ pageSize: 10 }}
      />
    </Modal>
  );
};

export default PriceHistoryModal;
