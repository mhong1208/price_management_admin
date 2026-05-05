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
      title={readOnly ? 'Chi tiết nhà cung cấp' : (isEdit ? 'Chỉnh sửa nhà cung cấp' : 'Thêm mới nhà cung cấp')}
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
          name="supplierCode"
          label="Mã nhà cung cấp"
          tooltip="Hệ thống tự động sinh mã nếu để trống"
        >
          <Input placeholder="Tự động sinh mã" disabled={isEdit} />
        </Form.Item>
        <Form.Item
          name="supplierName"
          label="Tên nhà cung cấp"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}
        >
          <Input placeholder="Ví dụ: Công ty TNHH ABC" />
        </Form.Item>
        <Form.Item
          name="taxCode"
          label="Mã số thuế"
        >
          <Input placeholder="Nhập mã số thuế doanh nghiệp" />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="contactPerson"
              label="Người liên hệ"
            >
              <Input placeholder="Ví dụ: Nguyễn Văn A" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
            >
              <Input placeholder="Ví dụ: 0987654321" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
        >
          <Input placeholder="Ví dụ: contact@abc.com" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
        >
          <Input.TextArea rows={2} placeholder="Ví dụ: 123 Đường ABC, Quận 1, TP. HCM" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Ghi chú/Mô tả"
        >
          <Input.TextArea rows={3} placeholder="Nhập ghi chú thêm về nhà cung cấp" />
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
    </Drawer>
  );
};

export default SupplierDrawer;
