import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, Button, Select, Space, Row, Col, DatePicker, InputNumber } from 'antd';
import dayjs from 'dayjs';
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
          effectiveDate: initialValues.effectiveDate ? dayjs(initialValues.effectiveDate) : null,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ currency: 'VND', effectiveDate: dayjs() });
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
        effectiveDate: values.effectiveDate?.toISOString(),
      };
      onSave(formattedValues);
    });
  };

  return (
    <Drawer
      title={readOnly ? 'Chi tiết bảng giá' : (isEdit ? 'Chỉnh sửa bảng giá' : 'Thiết lập giá mới')}
      size='large'
      onClose={onClose}
      open={open}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>{readOnly ? 'Đóng' : 'Hủy'}</Button>
            {!readOnly && (
              <Button onClick={handleSubmit} type="primary" loading={loading}>
                {isEdit ? 'Cập nhật' : 'Lưu lại'}
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
              label="Mặt hàng"
              rules={[{ required: true, message: 'Vui lòng chọn mặt hàng' }]}
            >
              <Select
                showSearch
                placeholder="Chọn mặt hàng"
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
              label="Nhà cung cấp"
              rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
            >
              <Select
                showSearch
                placeholder="Chọn nhà cung cấp"
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
              label="Giá"
              rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
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
              label="Tiền tệ"
              rules={[{ required: true, message: 'Vui lòng chọn tiền tệ' }]}
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
              label="Ngày hiệu lực"
              rules={[{ required: true, message: 'Vui lòng chọn ngày hiệu lực' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="notes"
          label="Ghi chú"
        >
          <Input.TextArea rows={4} placeholder="Nhập ghi chú chi tiết..." />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default PriceDrawer;
