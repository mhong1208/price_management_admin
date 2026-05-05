import apiClient from '../api/api-client';
import { Supplier } from '@/interfaces/supplier';
import { EndPoint } from '@/api/endpoint';
import { PaginationRequest, PaginationResponse } from './item-service';

export const supplierService = {
  getSuppliers: async (): Promise<Supplier[]> => {
    return apiClient.get(EndPoint.Suppliers);
  },

  getSuppliersPagination: async (params: PaginationRequest): Promise<PaginationResponse<Supplier>> => {
    return apiClient.post(`${EndPoint.Suppliers}/pagination`, params);
  },

  getSupplierById: async (id: string): Promise<Supplier> => {
    return apiClient.get(`${EndPoint.Suppliers}/${id}`);
  },

  createSupplier: async (data: Partial<Supplier>): Promise<Supplier> => {
    return apiClient.post(EndPoint.Suppliers, data);
  },

  updateSupplier: async (id: string, data: Partial<Supplier>): Promise<Supplier> => {
    return apiClient.put(`${EndPoint.Suppliers}/${id}`, data);
  },

  deleteSupplier: async (id: string): Promise<Supplier> => {
    return apiClient.delete(`${EndPoint.Suppliers}/${id}`);
  },
};
