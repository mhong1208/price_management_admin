'use client';

import { useState, useEffect } from 'react';
import { Typography, Button, Space, Tag, App, Pagination, Input, Select, Collapse } from 'antd';
import { PlusOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import BaseGrid from '@/components/shared/BaseGrid';
import TableActions from '@/components/shared/TableActions';
import SupplierDrawer from './components/SupplierDrawer';
import { Supplier } from '@/interfaces/supplier';
import { supplierService } from '@/services/supplier-service';

const SuppliersPage = () => {
  const { message, modal } = App.useApp();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [changes, setChanges] = useState<Map<string, Supplier>>(new Map());

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setCurrentPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    fetchSuppliers();
    setChanges(new Map());
  }, [currentPage, pageSize, statusFilter, debouncedSearch]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await supplierService.getSuppliersPagination({
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        searchText: debouncedSearch || null,
        status: statusFilter,
      });
      setSuppliers(response.items);
      setTotalCount(response.totalCount);
    } catch (error) {
      message.error('Không thể tải danh sách nhà cung cấp');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedSupplier(null);
    setIsViewOnly(false);
    setIsDrawerOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewOnly(false);
    setIsDrawerOpen(true);
  };

  const handleView = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewOnly(true);
    setIsDrawerOpen(true);
  };

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      if (selectedSupplier) {
        await supplierService.updateSupplier(selectedSupplier.id.toString(), values);
        message.success('Cập nhật nhà cung cấp thành công');
      } else {
        await supplierService.createSupplier(values);
        message.success('Thêm mới nhà cung cấp thành công');
      }
      setIsDrawerOpen(false);
      fetchSuppliers();
    } catch (error) {
      message.error('Lỗi khi lưu nhà cung cấp');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (supplier: Supplier) => {
    modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa nhà cung cấp "${supplier.supplierName}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await supplierService.deleteSupplier(supplier.id.toString());
          message.success('Xóa nhà cung cấp thành công');
          fetchSuppliers();
        } catch (error) {
          message.error('Lỗi khi xóa nhà cung cấp');
        }
      },
    });
  };

  const onCellValueChanged = (event: any) => {
    const { data, oldValue, newValue } = event;
    if (oldValue === newValue) return;

    const newChanges = new Map(changes);
    newChanges.set(data.id, data);
    setChanges(newChanges);
  };

  const handleBulkSave = async () => {
    if (changes.size === 0) return;

    try {
      setLoading(true);
      const updatePromises = Array.from(changes.values()).map(supplier =>
        supplierService.updateSupplier(supplier.id.toString(), supplier)
      );
      await Promise.all(updatePromises);
      message.success(`Đã lưu ${changes.size} thay đổi thành công`);
      setChanges(new Map());
      fetchSuppliers();
    } catch (error) {
      message.error('Lỗi khi lưu các thay đổi');
    } finally {
      setLoading(false);
    }
  };

  const columnDefs: any[] = [
    { field: 'supplierCode', headerName: 'Mã NCC', minWidth: 120, editable: true },
    { field: 'supplierName', headerName: 'Tên Nhà cung cấp', minWidth: 200, editable: true },
    { field: 'taxCode', headerName: 'Mã số thuế', minWidth: 150, editable: true },
    { field: 'contactPerson', headerName: 'Người liên hệ', minWidth: 150, editable: true },
    { field: 'phone', headerName: 'Số điện thoại', minWidth: 120, editable: true },
    { field: 'email', headerName: 'Email', minWidth: 180, editable: true },
    { field: 'description', headerName: 'Ghi chú', minWidth: 200, editable: true },
    {
      field: 'status',
      headerName: 'Trạng thái',
      minWidth: 120,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: [1, 0]
      },
      cellRenderer: (params: any) => (
        <Tag color={params.value === 1 ? 'green' : 'red'}>
          {params.value === 1 ? 'Hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      )
    },
    {
      headerName: 'Thao tác',
      minWidth: 100,
      pinned: 'right',
      cellRenderer: (params: any) => {
        const hasChanges = changes.has(params.data.id);
        return (
          <TableActions
            onView={() => handleView(params.data)}
            onEdit={() => handleEdit(params.data)}
            onDelete={() => handleDelete(params.data)}
            isSaving={loading && hasChanges}
          />
        );
      }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Collapse
        defaultActiveKey={['0']}
        items={[
          {
            key: 'filter',
            label: 'Bộ lọc tìm kiếm',
            children: (
              <Space wrap>
                <Input
                  placeholder="Tìm theo mã hoặc tên..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                  allowClear
                />
                <Select
                  placeholder="Trạng thái"
                  style={{ width: 160 }}
                  allowClear
                  value={statusFilter}
                  onChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}
                >
                  <Select.Option value={1}>Hoạt động</Select.Option>
                  <Select.Option value={0}>Ngừng hoạt động</Select.Option>
                </Select>
              </Space>
            )
          }
        ]}
      />

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm Nhà cung cấp
          </Button>
          {changes.size > 0 && (
            <Button
              type="primary"
              danger
              icon={<SaveOutlined />}
              onClick={handleBulkSave}
              loading={loading}
            >
              Lưu {changes.size} thay đổi
            </Button>
          )}
        </Space>
      </div>

      <BaseGrid
        rowData={suppliers}
        columnDefs={columnDefs}
        loading={loading}
        pagination={true}
        paginationPageSize={pageSize}
        suppressPaginationPanel={true}
        onCellValueChanged={onCellValueChanged}
        singleClickEdit={true}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <Typography.Text type="secondary">
          Hiển thị {suppliers.length} / {totalCount} bản ghi
        </Typography.Text>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalCount}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100']}
        />
      </div>

      <SupplierDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        initialValues={selectedSupplier}
        onSave={handleSave}
        loading={loading}
        readOnly={isViewOnly}
      />
    </div>
  );
};

export default SuppliersPage;
