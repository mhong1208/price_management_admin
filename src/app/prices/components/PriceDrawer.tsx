import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, Button, Select, Space, Row, Col, DatePicker, InputNumber } from 'antd';
import dayjs from '@/utils/date-utils';
import { Price } from '@/interfaces/price';
import { CURRENCIES } from '@/constants/item-enums';
import { itemService } from '@/services/item-service';
import { supplierService } from '@/services/supplier-service';
import { Item } from '@/interfaces/item';
import { Supplier } from '@/interfaces/supplier';

interface PriceDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Price | null;
  onSave: (values: any) => void;
  loading?: boolean;
  readOnly?: boolean;
}

const PriceDrawer: React.FC<PriceDrawerProps> = ({
  open,
  onClose,
  initialValues,
  onSave,
  loading = false,
  readOnly = false,
}) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<Item[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [fetching, setFetching] = useState(false);
  const isEdit = !!initialValues;

  useEffect(() => {
    if (open) {
      loadData();
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          effectiveDate: initialValues.effectiveDate ? dayjs.utc(initialValues.effectiveDate).tz('Asia/Ho_Chi_Minh') : null,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ 
          currency: 'VND', 
          effectiveDate: dayjs().tz('Asia/Ho_Chi_Minh') 
        });
      }
    }
  }, [open, initialValues, form]);

  const loadData = async () => {
    try {
      setFetching(true);
      const [itemsRes, suppliersRes] = await Promise.all([
        itemService.getItems(),
        supplierService.getSuppliers(),
      ]);
      setItems(itemsRes);
      setSuppliers(suppliersRes);
    } catch (error) {
      console.error('Failed to load items or suppliers', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        // Keep it as a string in ISO format for the API, but ensure it's at start of day in local time
        effectiveDate: values.effectiveDate?.startOf('day').toISOString(),
      };
      onSave(formattedValues);
    });
  };

  return (
    <Drawer
      title={readOnly ? 'Price Details' : (isEdit ? 'Edit Price' : 'Setup New Price')}
      size='large'
      onClose={onClose}
      open={open}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>{readOnly ? 'Close' : 'Cancel'}</Button>
            {!readOnly && (
              <Button onClick={handleSubmit} type="primary" loading={loading}>
                {isEdit ? 'Update' : 'Save'}
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="itemId"
              label="Item"
              rules={[{ required: true, message: 'Please select an item' }]}
            >
              <Select
                showSearch
                placeholder="Select item"
                optionFilterProp="children"
                loading={fetching}
              >
                {items.map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.itemCode} - {item.itemName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="supplierId"
              label="Supplier"
              rules={[{ required: true, message: 'Please select a supplier' }]}
            >
              <Select
                showSearch
                placeholder="Select supplier"
                optionFilterProp="children"
                loading={fetching}
              >
                {suppliers.map(s => (
                  <Select.Option key={s.id} value={s.id}>
                    {s.supplierCode} - {s.supplierName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                placeholder="0.00"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="currency"
              label="Currency"
              rules={[{ required: true, message: 'Please select currency' }]}
            >
              <Select>
                {CURRENCIES.map(c => (
                  <Select.Option key={c.code} value={c.code}>{c.code} - {c.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="effectiveDate"
              label="Effective Date"
              rules={[{ required: true, message: 'Please select effective date' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <Input.TextArea rows={4} placeholder="Enter detailed notes..." />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default PriceDrawer;
