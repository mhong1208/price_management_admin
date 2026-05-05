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
}
