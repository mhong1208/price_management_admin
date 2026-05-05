'use client';

import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  GridOptions,
  ModuleRegistry,
  ClientSideRowModelModule,
  ValidationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  PaginationModule
} from 'ag-grid-community';

// Register AG Grid Modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  PaginationModule
]);

interface BaseGridProps {
  rowData: any[];
  columnDefs: ColDef[];
  pagination?: boolean;
  paginationPageSize?: number;
  onGridReady?: (params: any) => void;
  [key: string]: any;
}

const BaseGrid: React.FC<BaseGridProps> = ({
  rowData,
  columnDefs,
  pagination = true,
  paginationPageSize = 10,
  onGridReady,
  ...rest
}) => {
  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    filter: true,
    sortable: true,
    resizable: true,
  }), []);

  return (
    <div className="ag-theme-alpine" style={{ width: '100%', height: '600px' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        onGridReady={onGridReady}
        {...rest}
      />
    </div>
  );
};

export default BaseGrid;
