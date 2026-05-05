import React, { useEffect } from 'react';
import { Drawer, Form, Input, Button, Select, Space, Row, Col } from 'antd';
import { Supplier } from '@/interfaces/supplier';

interface SupplierDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Supplier | null;
  onSave: (values: any) => void;
  loading?: boolean;
  readOnly?: boolean;
}

const SupplierDrawer: React.FC<SupplierDrawerProps> = ({
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

  return (
    <Drawer
      title={readOnly ? 'Supplier Details' : (isEdit ? 'Edit Supplier' : 'Add New Supplier')}
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
          name="supplierCode"
          label="Supplier Code"
          tooltip="System automatically generates a code if left empty"
        >
          <Input placeholder="Auto-generate code" disabled={isEdit} />
        </Form.Item>
        <Form.Item
          name="supplierName"
          label="Supplier Name"
          rules={[{ required: true, message: 'Please enter supplier name' }]}
        >
          <Input placeholder="Example: ABC Company" />
        </Form.Item>
        <Form.Item
          name="taxCode"
          label="Tax Code"
        >
          <Input placeholder="Enter company tax code" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="contactPerson"
              label="Contact Person"
            >
              <Input placeholder="Example: John Doe" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone"
            >
              <Input placeholder="Example: 0987654321" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: 'email', message: 'Invalid email' }]}
        >
          <Input placeholder="Example: contact@abc.com" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Address"
        >
          <Input.TextArea rows={2} placeholder="Example: 123 ABC Street, District 1, HCM City" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Notes/Description"
        >
          <Input.TextArea rows={3} placeholder="Enter additional notes about the supplier" />
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
    </Drawer>
  );
};

export default SupplierDrawer;
