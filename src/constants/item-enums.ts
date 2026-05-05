export enum ItemStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface ItemEnumOption {
  code: string;
  name: string;
}

export const ITEM_UNITS: ItemEnumOption[] = [
  { code: 'PCS', name: 'Piece' },
  { code: 'SET', name: 'Set' },
  { code: 'UNIT', name: 'Unit' },
  { code: 'BOX', name: 'Box' },
  { code: 'BAR', name: 'Bar' },
  { code: 'KG', name: 'Kilogram' },
  { code: 'METER', name: 'Meter' },
  { code: 'PACK', name: 'Pack' },
  { code: 'CTN', name: 'Carton' },
];

export const ITEM_CATEGORIES: ItemEnumOption[] = [
  { code: 'LTB', name: 'Lifestyle & Technical Bags' },
  { code: 'MCG', name: 'Mother & Child Gear' },
  { code: 'MTX', name: 'Medical Textiles' },
  { code: 'EAC', name: 'Electronic Accessories' },
  { code: 'RMT', name: 'Raw Materials (Nguyên vật liệu)' },
];
