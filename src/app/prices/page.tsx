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
      message.error('Failed to load price list');
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
        message.success('Price list updated successfully');
      } else {
        await priceService.createPrice(values);
        message.success('New price setup successfully');
      }
      setIsDrawerOpen(false);
      fetchPrices();
    } catch (error) {
      message.error('Error saving price list');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (price: Price) => {
    modal.confirm({
      title: 'Confirm Delete',
      content: `Delete price setup for item "${price.item?.itemName}" from supplier "${price.supplier?.supplierName}"?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await priceService.deletePrice(price.id.toString());
          message.success('Record deleted successfully');
          fetchPrices();
        } catch (error) {
          message.error('Error deleting record');
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
      message.success(`Saved ${changes.size} changes successfully`);
      setChanges(new Map());
      fetchPrices();
    } catch (error) {
      message.error('Error saving changes');
    } finally {
      setLoading(false);
    }
  };

  const columnDefs: any[] = [
    {
      headerName: 'Item',
      field: 'item.itemName',
      minWidth: 200,
      valueGetter: (params: any) => `${params.data.item?.itemCode} - ${params.data.item?.itemName}`
    },
    {
      headerName: 'Supplier',
      field: 'supplier.supplierName',
      minWidth: 200,
      valueGetter: (params: any) => `${params.data.supplier?.supplierCode} - ${params.data.supplier?.supplierName}`
    },
    {
      headerName: 'Price',
      field: 'price',
      minWidth: 120,
      editable: true,
      cellEditor: 'agNumberCellEditor',
      valueFormatter: (params: any) => new Intl.NumberFormat().format(params.value)
    },
    {
      headerName: 'Currency',
      field: 'currency',
      minWidth: 100,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: CURRENCIES.map(c => c.code)
      }
    },
    {
      headerName: 'Effective Date',
      field: 'effectiveDate',
      minWidth: 150,
      editable: true,
      valueFormatter: (params: any) => dayjs(params.value).format('DD/MM/YYYY')
    },
    {
      headerName: 'Actions',
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
            label: 'Search Filters',
            children: (
              <Space wrap>
                <Input
                  placeholder="Search by item or supplier..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                  allowClear
                />
                <Select
                  placeholder="Filter by item"
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
                  placeholder="Filter by supplier"
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
            Setup New Price
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
          Showing {prices.length} / {totalCount} records
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
