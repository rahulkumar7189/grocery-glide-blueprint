import { GroceryItem, StatsData } from "@/types/grocery";
import { differenceInDays } from "date-fns";

export const calculateStats = (items: GroceryItem[]): StatsData => {
  const now = new Date();
  
  const expiringSoon = items.filter((item) => {
    if (!item.expiryDate) return false;
    const daysUntilExpiry = differenceInDays(item.expiryDate, now);
    return daysUntilExpiry > 0 && daysUntilExpiry <= 3;
  }).length;

  const expired = items.filter((item) => {
    if (!item.expiryDate) return false;
    return differenceInDays(item.expiryDate, now) < 0;
  }).length;

  const lowStock = items.filter((item) => item.quantity <= 2).length;
  const shoppingListCount = items.filter((item) => item.isInShoppingList).length;

  return {
    totalItems: items.length,
    expiringSoon,
    expired,
    lowStock,
    shoppingListCount,
  };
};

export const getExpiryStatus = (expiryDate?: Date): "expired" | "expiring" | "fresh" | "none" => {
  if (!expiryDate) return "none";
  
  const now = new Date();
  const daysUntilExpiry = differenceInDays(expiryDate, now);
  
  if (daysUntilExpiry < 0) return "expired";
  if (daysUntilExpiry <= 3) return "expiring";
  return "fresh";
};

export const getExpiryColor = (status: string): string => {
  switch (status) {
    case "expired":
      return "text-destructive";
    case "expiring":
      return "text-warning";
    case "fresh":
      return "text-success";
    default:
      return "text-muted-foreground";
  }
};
