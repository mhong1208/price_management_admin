import apiClient from '../api/api-client';
import { Item } from '@/interfaces/item';
import { EndPoint } from '@/api/endpoint';

export interface PaginationRequest {
  skip: number;
  take: number;
  searchText?: string | null;
  category?: string | null;
  status?: number | null;
}

export interface PaginationResponse<T> {
  items: T[];
  totalCount: number;
}

export const itemService = {
  getItems: async (): Promise<Item[]> => {
    return apiClient.get(EndPoint.Items);
  },

  getItemsPagination: async (params: PaginationRequest): Promise<PaginationResponse<Item>> => {
    return apiClient.post(`${EndPoint.Items}/pagination`, params);
  },

  getItemById: async (id: string): Promise<Item> => {
    return apiClient.get(`${EndPoint.Items}/${id}`);
  },

  createItem: async (data: Partial<Item>): Promise<Item> => {
    return apiClient.post(EndPoint.Items, data);
  },

  updateItem: async (id: string, data: Partial<Item>): Promise<Item> => {
    return apiClient.put(`${EndPoint.Items}/${id}`, data);
  },

  deleteItem: async (id: string): Promise<Item> => {
    return apiClient.delete(`${EndPoint.Items}/${id}`);
  },
};
