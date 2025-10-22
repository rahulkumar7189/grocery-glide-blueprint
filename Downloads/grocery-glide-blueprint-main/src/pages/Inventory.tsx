import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import ItemCard from "@/components/ItemCard";
import AddItemDialog from "@/components/AddItemDialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { storageService } from "@/lib/storage";
import { GroceryItem, GroceryCategory } from "@/types/grocery";
import { Search, Package } from "lucide-react";
import { toast } from "sonner";

const categories: (GroceryCategory | "All")[] = [
  "All",
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Meat & Fish",
  "Bakery",
  "Pantry",
  "Beverages",
  "Snacks",
  "Frozen",
  "Other",
];

const Inventory = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const loadedItems = storageService.getItems();
    setItems(loadedItems);
  };

  const handleAddItem = (item: GroceryItem) => {
    storageService.addItem(item);
    loadItems();
  };

  const handleDeleteItem = (id: string) => {
    storageService.deleteItem(id);
    loadItems();
    toast.success("Item removed");
  };

  const handleToggleShoppingList = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      storageService.updateItem(id, { isInShoppingList: !item.isInShoppingList });
      loadItems();
      toast.success(item.isInShoppingList ? "Removed from shopping list" : "Added to shopping list");
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout onAddItem={() => setDialogOpen(true)}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Inventory</h2>
          <p className="text-muted-foreground">Manage all your grocery items</p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onDelete={handleDeleteItem}
                onToggleShoppingList={handleToggleShoppingList}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>
                {searchTerm || selectedCategory !== "All"
                  ? "No items match your filters"
                  : "No items in inventory"}
              </p>
            </div>
          )}
        </div>
      </div>

      <AddItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddItem={handleAddItem}
      />
    </Layout>
  );
};

export default Inventory;
