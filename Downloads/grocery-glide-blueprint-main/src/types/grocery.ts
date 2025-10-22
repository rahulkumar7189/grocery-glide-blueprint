export type GroceryCategory = 
  | "Fruits & Vegetables"
  | "Dairy & Eggs"
  | "Meat & Fish"
  | "Bakery"
  | "Pantry"
  | "Beverages"
  | "Snacks"
  | "Frozen"
  | "Other";

export interface GroceryItem {
  id: string;
  name: string;
  category: GroceryCategory;
  quantity: number;
  unit: string;
  expiryDate?: Date;
  purchaseDate: Date;
  notes?: string;
  isInShoppingList?: boolean;
}

export interface StatsData {
  totalItems: number;
  expiringSoon: number;
  expired: number;
  lowStock: number;
  shoppingListCount: number;
}
