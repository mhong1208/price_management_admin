import { Supplier } from "./supplier";

export interface SupplierPrice {
  id: string;
  supplier: Supplier;
  price: number;
  currency: string;
  effectiveDate: string;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface Item {
  id: string;
  itemCode: string;
  itemName: string;
  description?: string;
  unit?: string;
  category?: string;
  status: number; // 1 for active, 0 for inactive
  createdAt?: string;
  updatedAt?: string;
  supplierPrices?: SupplierPrice[];
}
