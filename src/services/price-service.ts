import apiClient from '../api/api-client';
import { Price } from '@/interfaces/price';
import { EndPoint } from '@/api/endpoint';
import { PaginationRequest, PaginationResponse } from './item-service';

export interface PricePaginationRequest extends PaginationRequest {
  itemId?: string | null;
  supplierId?: string | null;
}

export interface PriceHistory {
  id: string;
  itemId: string;
  itemName: string;
  supplierId: string;
  supplierName: string;
  oldPrice: number;
  newPrice: number;
  currency: string;
  effectiveDate: string;
  action: string;
  notes?: string;
  createdAt: string;
}

export const priceService = {
  getPrices: async (): Promise<Price[]> => {
    return apiClient.get(EndPoint.Prices);
  },

  getPricesPagination: async (params: PricePaginationRequest): Promise<PaginationResponse<Price>> => {
    return apiClient.post(`${EndPoint.Prices}/pagination`, params);
  },

  getPriceById: async (id: string): Promise<Price> => {
    return apiClient.get(`${EndPoint.Prices}/${id}`);
  },

  createPrice: async (data: Partial<Price>): Promise<Price> => {
    return apiClient.post(EndPoint.Prices, data);
  },

  updatePrice: async (id: string, data: Partial<Price>): Promise<Price> => {
    return apiClient.put(`${EndPoint.Prices}/${id}`, data);
  },

  deletePrice: async (id: string): Promise<Price> => {
    return apiClient.delete(`${EndPoint.Prices}/${id}`);
  },

  getPriceHistory: async (itemId: string, supplierId: string): Promise<PriceHistory[]> => {
    const response = await apiClient.get<PaginationResponse<PriceHistory>>(`${EndPoint.Prices}/history`, {
      params: { itemId, supplierId, skip: 0, take: 100 }
    });
    return (response as any).items || [];
  },
};
