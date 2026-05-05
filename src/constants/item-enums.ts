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
  { code: 'RMT', name: 'Raw Materials' },
];

export const CURRENCIES: ItemEnumOption[] = [
  { code: 'VND', name: 'Vietnamese Dong' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'THB', name: 'Thai Baht' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
  { code: 'IDR', name: 'Indonesian Rupiah' },
  { code: 'PHP', name: 'Philippine Peso' },
  { code: 'CNY', name: 'Chinese Yuan Renminbi (China)' },
  { code: 'JPY', name: 'Japanese Yen (Japan)' },
  { code: 'KRW', name: 'South Korean Won (South Korea)' },
  { code: 'HKD', name: 'Hong Kong Dollar (Hong Kong)' },
  { code: 'TWD', name: 'New Taiwan Dollar (Taiwan)' },
  { code: 'USD', name: 'United States Dollar (USA)' },
  { code: 'EUR', name: 'Euro (European Union)' },
  { code: 'GBP', name: 'British Pound Sterling (United Kingdom)' },
  { code: 'AUD', name: 'Australian Dollar (Australia)' },
  { code: 'CAD', name: 'Canadian Dollar (Canada)' },
  { code: 'CHF', name: 'Swiss Franc (Switzerland)' },
  { code: 'INR', name: 'Indian Rupee (India)' },
  { code: 'NZD', name: 'New Zealand Dollar (New Zealand)' },
];
