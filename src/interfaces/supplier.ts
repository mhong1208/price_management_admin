export interface Supplier {
  id: string;
  supplierCode: string;
  supplierName: string;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  taxCode?: string | null;
  description?: string | null;
  status: number; // 1 for active, 0 for inactive
  createdAt?: string;
  updatedAt?: string;
}
