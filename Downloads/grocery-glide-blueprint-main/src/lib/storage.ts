import { GroceryItem } from "@/types/grocery";

const STORAGE_KEY = "grocery_items";

export const storageService = {
  getItems: (): GroceryItem[] => {
    try {
      const items = localStorage.getItem(STORAGE_KEY);
      if (!items) return [];
      return JSON.parse(items).map((item: any) => ({
        ...item,
        purchaseDate: new Date(item.purchaseDate),
        expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
      }));
    } catch (error) {
      console.error("Error loading items:", error);
      return [];
    }
  },

  saveItems: (items: GroceryItem[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving items:", error);
    }
  },

  addItem: (item: GroceryItem): void => {
    const items = storageService.getItems();
    items.push(item);
    storageService.saveItems(items);
  },

  updateItem: (id: string, updates: Partial<GroceryItem>): void => {
    const items = storageService.getItems();
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      storageService.saveItems(items);
    }
  },

  deleteItem: (id: string): void => {
    const items = storageService.getItems();
    const filtered = items.filter((item) => item.id !== id);
    storageService.saveItems(filtered);
  },
};
