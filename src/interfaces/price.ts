import { Item } from "./item";
import { Supplier } from "./supplier";

export interface Price {
  id: string;
  itemId: string;
  item?: Item;
  supplierId: string;
  supplier?: Supplier;
  price: number;
  currency: string;
  effectiveDate: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
