'use client';

import { useState, useEffect } from 'react';
import { Typography, Button, Space, App, Pagination, Input, Select, Collapse } from 'antd';
import { PlusOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from '@/utils/date-utils';
import BaseGrid from '@/components/shared/BaseGrid';
import TableActions from '@/components/shared/TableActions';
import PriceDrawer from './components/PriceDrawer';
import PriceHistoryModal from './components/PriceHistoryModal';
import { Price } from '@/interfaces/price';
import { priceService } from '@/services/price-service';
import { itemService } from '@/services/item-service';
import { supplierService } from '@/services/supplier-service';
import { Item } from '@/interfaces/item';
import { Supplier } from '@/interfaces/supplier';
import { CURRENCIES } from '@/constants/item-enums';

const PricesPage = () => {
  const { message, modal } = App.useApp();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterItemId, setFilterItemId] = useState<string | null>(null);
  const [filterSupplierId, setFilterSupplierId] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);
  const [prices, setPrices] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [changes, setChanges] = useState<Map<string, Price>>(new Map());

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const [itemsRes, suppliersRes] = await Promise.all([
        itemService.getItems(),
        supplierService.getSuppliers(),
      ]);
      setItems(itemsRes);
      setSuppliers(suppliersRes);
    } catch (error) {
      console.error('Failed to load filter options', error);
    }
  };

  useEffect(() => {
    fetchPrices();
    setChanges(new Map());
  }, [currentPage, pageSize, debouncedSearch, filterItemId, filterSupplierId]);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const response = await priceService.getPricesPagination({
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
        searchText: debouncedSearch || null,
        itemId: filterItemId,
        supplierId: filterSupplierId,
      });
      setPrices(response.items);
      setTotalCount(response.totalCount);
    } catch (error) {
      message.error('Không thể tải danh sách bảng giá');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedPrice(null);
    setIsViewOnly(false);
    setIsDrawerOpen(true);
  };

  const handleEdit = (price: Price) => {
    setSelectedPrice(price);
    setIsViewOnly(false);
    setIsDrawerOpen(true);
  };

  const handleView = (price: Price) => {
    setSelectedPrice(price);
    setIsViewOnly(true);
    setIsDrawerOpen(true);
  };

  const handleHistory = (price: Price) => {
    setSelectedPrice(price);
    setIsHistoryOpen(true);
  };

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      if (selectedPrice) {
        await priceService.updatePrice(selectedPrice.id.toString(), values);
        message.success('Cập nhật bảng giá thành công');
      } else {
        await priceService.createPrice(values);
        message.success('Thiết lập giá mới thành công');
      }
      setIsDrawerOpen(false);
      fetchPrices();
    } catch (error) {
      message.error('Lỗi khi lưu bảng giá');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (price: Price) => {
    modal.confirm({
      title: 'Xác nhận xóa',
      content: `Xóa thiết lập giá cho mặt hàng "${price.item?.itemName}" từ NCC "${price.supplier?.supplierName}"?`,
      okText: 'Xóa',
      okType: 'danger',
      onOk: async () => {
        try {
          await priceService.deletePrice(price.id.toString());
          message.success('Xóa bản ghi thành công');
          fetchPrices();
        } catch (error) {
          message.error('Lỗi khi xóa bản ghi');
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
      const updatePromises = Array.from(changes.values()).map(p =>
        priceService.updatePrice(p.id.toString(), p)
      );
      await Promise.all(updatePromises);
      message.success(`Đã lưu ${changes.size} thay đổi thành công`);
      setChanges(new Map());
      fetchPrices();
    } catch (error) {
      message.error('Lỗi khi lưu các thay đổi');
    } finally {
      setLoading(false);
    }
  };

  const columnDefs: any[] = [
    {
      headerName: 'Mặt hàng',
      field: 'item.itemName',
      minWidth: 200,
      valueGetter: (params: any) => `${params.data.item?.itemCode} - ${params.data.item?.itemName}`
    },
    {
      headerName: 'Nhà cung cấp',
      field: 'supplier.supplierName',
      minWidth: 200,
      valueGetter: (params: any) => `${params.data.supplier?.supplierCode} - ${params.data.supplier?.supplierName}`
    },
    {
      headerName: 'Giá',
      field: 'price',
      minWidth: 120,
      editable: true,
      cellEditor: 'agNumberCellEditor',
      valueFormatter: (params: any) => new Intl.NumberFormat().format(params.value)
    },
    {
      headerName: 'Tiền tệ',
      field: 'currency',
      minWidth: 100,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: CURRENCIES.map(c => c.code)
      }
    },
    {
      headerName: 'Ngày hiệu lực',
      field: 'effectiveDate',
      minWidth: 150,
      editable: true,
      valueFormatter: (params: any) => dayjs(params.value).format('DD/MM/YYYY')
    },
    {
      headerName: 'Thao tác',
      minWidth: 120,
      pinned: 'right',
      cellRenderer: (params: any) => {
        const hasChanges = changes.has(params.data.id);
        return (
          <TableActions
            onView={() => handleView(params.data)}
            onEdit={() => handleEdit(params.data)}
            onDelete={() => handleDelete(params.data)}
            onHistory={() => handleHistory(params.data)}
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
                  placeholder="Tìm theo hàng hóa hoặc NCC..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                  allowClear
                />
                <Select
                  placeholder="Lọc theo mặt hàng"
                  style={{ width: 200 }}
                  allowClear
                  value={filterItemId}
                  onChange={setFilterItemId}
                  showSearch
                  optionFilterProp="children"
                >
                  {items.map(i => (
                    <Select.Option key={i.id} value={i.id}>{i.itemCode} - {i.itemName}</Select.Option>
                  ))}
                </Select>
                <Select
                  placeholder="Lọc theo nhà cung cấp"
                  style={{ width: 200 }}
                  allowClear
                  value={filterSupplierId}
                  onChange={setFilterSupplierId}
                  showSearch
                  optionFilterProp="children"
                >
                  {suppliers.map(s => (
                    <Select.Option key={s.id} value={s.id}>{s.supplierCode} - {s.supplierName}</Select.Option>
                  ))}
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
            Thiết lập giá mới
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
        rowData={prices}
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
          Hiển thị {prices.length} / {totalCount} bản ghi
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

      <PriceDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        initialValues={selectedPrice}
        onSave={handleSave}
        loading={loading}
        readOnly={isViewOnly}
      />

      <PriceHistoryModal
        open={isHistoryOpen}
        onCancel={() => setIsHistoryOpen(false)}
        itemId={selectedPrice?.itemId}
        supplierId={selectedPrice?.supplierId}
        itemName={selectedPrice?.item?.itemName}
        supplierName={selectedPrice?.supplier?.supplierName}
      />
    </div>
  );
};

export default PricesPage;
