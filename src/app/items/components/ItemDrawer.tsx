import { Drawer, Form, Input, Button, Select, Space, Row, Col, Table, Typography, Divider } from 'antd';
import { Item, SupplierPrice } from '@/interfaces/item';
import { ITEM_UNITS, ITEM_CATEGORIES } from '@/constants/item-enums';
import { useEffect } from 'react';
import { formatDateVN } from '@/utils/date-utils';

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
      title: 'Supplier',
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
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: SupplierPrice) => (
        <Text strong>
          {new Intl.NumberFormat().format(price)} {record.currency}
        </Text>
      )
    },
    {
      title: 'Effective Date',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      render: (date: string) => formatDateVN(date),
    },
  ];

  return (
    <Drawer
      title={readOnly ? 'Item Details' : (isEdit ? 'Edit Item' : 'Add New Item')}
      size='large'
      onClose={onClose}
      open={open}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>{readOnly ? 'Close' : 'Cancel'}</Button>
            {!readOnly && (
              <Button onClick={handleSubmit} type="primary" loading={loading}>
                {isEdit ? 'Update' : 'Add New'}
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
          label="Item Code"
          tooltip="System automatically generates a code if left empty"
        >
          <Input placeholder="Auto-generate code" disabled={isEdit} />
        </Form.Item>
        <Form.Item
          name="itemName"
          label="Item Name"
          rules={[{ required: true, message: 'Please enter item name' }]}
        >
          <Input placeholder="Example: Dell Monitor" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="unit"
              label="Unit"
              rules={[{ required: true, message: 'Please select unit' }]}
            >
              <Select placeholder="Select unit">
                {ITEM_UNITS.map(unit => (
                  <Select.Option key={unit.code} value={unit.code}>{unit.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select placeholder="Select category">
                {ITEM_CATEGORIES.map(cat => (
                  <Select.Option key={cat.code} value={cat.code}>{cat.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="description"
          label="Description"
          tooltip="Detailed information about the item"
        >
          <Input.TextArea rows={4} placeholder="Example: Imported goods" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select>
            <Select.Option value={1}>Active</Select.Option>
            <Select.Option value={0}>Inactive</Select.Option>
          </Select>
        </Form.Item>
      </Form>

      {readOnly && initialValues?.supplierPrices && initialValues.supplierPrices.length > 0 && (
        <>
          <Divider>Linked Suppliers & Prices</Divider>
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
