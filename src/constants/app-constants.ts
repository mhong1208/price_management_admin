export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5086/api';

export const APP_ROUTES = {
  DASHBOARD: '/',
  ITEMS: '/items',
  SUPPLIERS: '/suppliers',
  PRICES: '/prices',
};

export const ITEM_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';
