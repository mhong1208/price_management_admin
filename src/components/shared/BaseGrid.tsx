'use client';

import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ModuleRegistry,
  ClientSideRowModelModule,
  ValidationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  PaginationModule,
  TextEditorModule,
  SelectEditorModule,
  UndoRedoEditModule
} from 'ag-grid-community';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  PaginationModule,
  TextEditorModule,
  SelectEditorModule,
  UndoRedoEditModule
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
    unSortIcon: true,
    resizable: true,
  }), []);

  return (
    <div className="ag-theme-alpine" style={{ width: '100%', height: '500px' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        onGridReady={onGridReady}
        undoRedoCellEditing={true}
        undoRedoCellEditingLimit={10}
        stopEditingWhenCellsLoseFocus={true}
        {...rest}
      />
    </div>
  );
};

export default BaseGrid;
