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
      message.error('Failed to load supplier list');
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
        message.success('Supplier updated successfully');
      } else {
        await supplierService.createSupplier(values);
        message.success('New supplier created successfully');
      }
      setIsDrawerOpen(false);
      fetchSuppliers();
    } catch (error) {
      message.error('Error saving supplier');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (supplier: Supplier) => {
    modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete supplier "${supplier.supplierName}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await supplierService.deleteSupplier(supplier.id.toString());
          message.success('Supplier deleted successfully');
          fetchSuppliers();
        } catch (error) {
          message.error('Error deleting supplier');
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
      message.success(`Saved ${changes.size} changes successfully`);
      setChanges(new Map());
      fetchSuppliers();
    } catch (error) {
      message.error('Error saving changes');
    } finally {
      setLoading(false);
    }
  };

  const columnDefs: any[] = [
    { field: 'supplierCode', headerName: 'Supplier Code', minWidth: 120, editable: true },
    { field: 'supplierName', headerName: 'Supplier Name', minWidth: 200, editable: true },
    { field: 'taxCode', headerName: 'Tax Code', minWidth: 150, editable: true },
    { field: 'contactPerson', headerName: 'Contact Person', minWidth: 150, editable: true },
    { field: 'phone', headerName: 'Phone', minWidth: 120, editable: true },
    { field: 'email', headerName: 'Email', minWidth: 180, editable: true },
    { field: 'description', headerName: 'Description', minWidth: 200, editable: true },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 120,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: [1, 0]
      },
      cellRenderer: (params: any) => (
        <Tag color={params.value === 1 ? 'green' : 'red'}>
          {params.value === 1 ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      headerName: 'Actions',
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
            label: 'Search Filters',
            children: (
              <Space wrap>
                <Input
                  placeholder="Search by code or name..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                  allowClear
                />
                <Select
                  placeholder="Status"
                  style={{ width: 160 }}
                  allowClear
                  value={statusFilter}
                  onChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}
                >
                  <Select.Option value={1}>Active</Select.Option>
                  <Select.Option value={0}>Inactive</Select.Option>
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
            Add Supplier
          </Button>
          {changes.size > 0 && (
            <Button
              type="primary"
              danger
              icon={<SaveOutlined />}
              onClick={handleBulkSave}
              loading={loading}
            >
              Save {changes.size} changes
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
          Showing {suppliers.length} / {totalCount} records
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
