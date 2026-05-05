'use client';

import { useState, useEffect } from 'react';
import { Typography, Button, Space, Tag, App, Pagination, Input, Select, Collapse } from 'antd';
import { PlusOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import BaseGrid from '@/components/shared/BaseGrid';
import TableActions from '@/components/shared/TableActions';
import ItemDrawer from './components/ItemDrawer';
import { Item } from '@/interfaces/item';
import { ITEM_UNITS, ITEM_CATEGORIES } from '@/constants/item-enums';
import { itemService } from '@/services/item-service';


const ItemsPage = () => {
  const { message, modal } = App.useApp();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [changes, setChanges] = useState<Map<string, Item>>(new Map());

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setCurrentPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    fetchItems();
    setChanges(new Map());
  }, [currentPage, pageSize, categoryFilter, statusFilter, debouncedSearch]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.getItemsPagination({
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        searchText: debouncedSearch || null,
        category: categoryFilter,
        status: statusFilter,
      });
      setItems(response.items);
      setTotalCount(response.totalCount);
    } catch (error) {
      message.error('Không thể tải danh sách hàng hóa');
    } finally {
      setLoading(false);
    }
  };


  const handleAdd = () => {
    setSelectedItem(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      if (selectedItem) {
        await itemService.updateItem(selectedItem.id.toString(), values);
        message.success('Cập nhật hàng hóa thành công');
      } else {
        await itemService.createItem(values);
        message.success('Thêm mới hàng hóa thành công');
      }
      setIsDrawerOpen(false);
      fetchItems();
    } catch (error) {
      message.error('Lỗi khi lưu hàng hóa');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item: Item) => {
    modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa hàng hóa "${item.itemName}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await itemService.deleteItem(item.id.toString());
          message.success('Xóa hàng hóa thành công');
          fetchItems();
        } catch (error) {
          message.error('Lỗi khi xóa hàng hóa');
        }
      },
    });
  };

  const onCellValueChanged = (event: any) => {
    const { data, oldValue, newValue, column } = event;
    if (oldValue === newValue) return;

    const newChanges = new Map(changes);
    newChanges.set(data.id, data);
    setChanges(newChanges);
  };

  const handleBulkSave = async () => {
    if (changes.size === 0) return;

    try {
      setLoading(true);
      const updatePromises = Array.from(changes.values()).map(item =>
        itemService.updateItem(item.id.toString(), item)
      );
      await Promise.all(updatePromises);
      message.success(`Đã lưu ${changes.size} thay đổi thành công`);
      setChanges(new Map());
      fetchItems();
    } catch (error) {
      message.error('Lỗi khi lưu các thay đổi');
    } finally {
      setLoading(false);
    }
  };

  const columnDefs: any[] = [
    { field: 'itemCode', headerName: 'Mã Hàng hóa', minWidth: 180, editable: true },
    { field: 'itemName', headerName: 'Tên Hàng hóa', minWidth: 200, editable: true },
    {
      field: 'unit',
      headerName: 'Đơn vị',
      minWidth: 100,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ITEM_UNITS.map(u => u.code)
      },
      valueFormatter: (params: any) => ITEM_UNITS.find(u => u.code === params.value)?.name || params.value
    },
    {
      field: 'category',
      headerName: 'Danh mục',
      minWidth: 150,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ITEM_CATEGORIES.map(c => c.code)
      },
      valueFormatter: (params: any) => ITEM_CATEGORIES.find(c => c.code === params.value)?.name || params.value
    },
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
                  placeholder="Chọn danh mục"
                  style={{ width: 220 }}
                  allowClear
                  value={categoryFilter}
                  onChange={(value) => { setCategoryFilter(value); setCurrentPage(1); }}
                >
                  {ITEM_CATEGORIES.map(cat => (
                    <Select.Option key={cat.code} value={cat.code}>{cat.name}</Select.Option>
                  ))}
                </Select>
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
            Thêm Hàng hóa
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
        rowData={items}
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
          Hiển thị {items.length} / {totalCount} bản ghi
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

      <ItemDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        initialValues={selectedItem}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
};

export default ItemsPage;
