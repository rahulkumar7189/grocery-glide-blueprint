import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { storageService } from "@/lib/storage";
import { GroceryItem } from "@/types/grocery";
import { ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Shopping = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const loadedItems = storageService.getItems();
    setItems(loadedItems.filter((item) => item.isInShoppingList));
  };

  const handleToggleCheck = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const handleRemoveFromList = (id: string) => {
    storageService.updateItem(id, { isInShoppingList: false });
    loadItems();
    toast.success("Removed from shopping list");
  };

  const handleClearCompleted = () => {
    checkedItems.forEach((id) => {
      storageService.updateItem(id, { isInShoppingList: false });
    });
    setCheckedItems(new Set());
    loadItems();
    toast.success("Cleared completed items");
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Shopping List</h2>
            <p className="text-muted-foreground">{items.length} items to buy</p>
          </div>
          {checkedItems.size > 0 && (
            <Button
              onClick={handleClearCompleted}
              variant="outline"
              size="sm"
              className="text-success border-success/30"
            >
              Clear ({checkedItems.size})
            </Button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <Card key={item.id} className="p-4 shadow-soft">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={checkedItems.has(item.id)}
                          onCheckedChange={() => handleToggleCheck(item.id)}
                          className="border-2"
                        />
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              checkedItems.has(item.id)
                                ? "line-through text-muted-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {item.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} {item.unit}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveFromList(item.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Your shopping list is empty</p>
            <p className="text-sm mt-1">Add items from your inventory to start</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Shopping;
