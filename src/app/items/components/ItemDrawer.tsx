import React, { useEffect } from 'react';
import { Drawer, Form, Input, Button, Select, Space, Row, Col, Table, Typography, Divider } from 'antd';
import { Item, SupplierPrice } from '@/interfaces/item';
import { ITEM_UNITS, ITEM_CATEGORIES } from '@/constants/item-enums';

const { Text } = Typography;

interface ItemDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Item | null;
  onSave: (values: any) => void;
  loading?: boolean;
  readOnly?: boolean;
}

const ItemDrawer: React.FC<ItemDrawerProps> = ({
  open,
  onClose,
  initialValues,
  onSave,
  loading = false,
  readOnly = false,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!initialValues;

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 1 });
      }
    }
  }, [open, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave(values);
    });
  };

  const supplierColumns = [
    {
      title: 'Nhà cung cấp',
      dataIndex: ['supplier', 'supplierName'],
      key: 'supplierName',
      render: (text: string, record: SupplierPrice) => (
        <Space orientation="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.supplier.supplierCode}</Text>
        </Space>
      )
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: SupplierPrice) => (
        <Text strong>
          {new Intl.NumberFormat().format(price)} {record.currency}
        </Text>
      )
    },
    {
      title: 'Ngày hiệu lực',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
    },
  ];

  return (
    <Drawer
      title={readOnly ? 'Chi tiết hàng hóa' : (isEdit ? 'Chỉnh sửa hàng hóa' : 'Thêm mới hàng hóa')}
      size='large'
      onClose={onClose}
      open={open}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>{readOnly ? 'Đóng' : 'Hủy'}</Button>
            {!readOnly && (
              <Button onClick={handleSubmit} type="primary" loading={loading}>
                {isEdit ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            )}
          </Space>
        </div>
      }
      styles={{ footer: { padding: '16px' } }}
    >
      <Form
        form={form}
        layout="vertical"
        disabled={readOnly}
      >
        <Form.Item
          name="itemCode"
          label="Mã hàng hóa"
          tooltip="Hệ thống tự động sinh mã nếu để trống"
        >
          <Input placeholder="Tự động sinh mã" disabled={isEdit} />
        </Form.Item>
        <Form.Item
          name="itemName"
          label="Tên hàng hóa"
          rules={[{ required: true, message: 'Vui lòng nhập tên hàng hóa' }]}
        >
          <Input placeholder="Ví dụ: Màn hình Dell" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="unit"
              label="Đơn vị"
              rules={[{ required: true, message: 'Vui lòng chọn đơn vị' }]}
            >
              <Select placeholder="Chọn đơn vị">
                {ITEM_UNITS.map(unit => (
                  <Select.Option key={unit.code} value={unit.code}>{unit.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
            >
              <Select placeholder="Chọn danh mục">
                {ITEM_CATEGORIES.map(cat => (
                  <Select.Option key={cat.code} value={cat.code}>{cat.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="description"
          label="Mô tả"
          tooltip="Thông tin mô tả về hàng hóa"
        >
          <Input.TextArea rows={4} placeholder="Ví dụ: Hàng nhập khẩu" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select>
            <Select.Option value={1}>Hoạt động</Select.Option>
            <Select.Option value={0}>Ngừng hoạt động</Select.Option>
          </Select>
        </Form.Item>
      </Form>

      {readOnly && initialValues?.supplierPrices && initialValues.supplierPrices.length > 0 && (
        <>
          <Divider>Danh sách nhà cung cấp & Giá</Divider>
          <Table
            dataSource={initialValues.supplierPrices}
            columns={supplierColumns}
            pagination={false}
            rowKey="id"
            size="small"
            bordered
          />
        </>
      )}
    </Drawer>
  );
};

export default ItemDrawer;
