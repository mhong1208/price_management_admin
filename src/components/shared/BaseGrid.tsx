'use client';

import { useMemo } from 'react';
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
  UndoRedoEditModule,
  GridReadyEvent,
  CellValueChangedEvent
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

interface BaseGridProps<T = Record<string, unknown>> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  pagination?: boolean;
  paginationPageSize?: number;
  onGridReady?: (params: GridReadyEvent<T>) => void;
  onCellValueChanged?: (event: CellValueChangedEvent<T>) => void;
  [key: string]: unknown;
}

const BaseGrid = <T extends Record<string, unknown>>({
  rowData,
  columnDefs,
  pagination = true,
  paginationPageSize = 10,
  onGridReady,
  ...rest
}: BaseGridProps<T>) => {
  const defaultColDef = useMemo<ColDef<T>>(() => ({
    flex: 1,
    minWidth: 100,
    filter: false,
    sortable: true,
    unSortIcon: true,
    resizable: true,
  }), []);

  return (
    <div className="ag-theme-alpine" style={{ width: '100%', height: '500px' }}>
      <AgGridReact<T>
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
