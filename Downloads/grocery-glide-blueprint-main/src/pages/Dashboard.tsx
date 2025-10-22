import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import ItemCard from "@/components/ItemCard";
import AddItemDialog from "@/components/AddItemDialog";
import { storageService } from "@/lib/storage";
import { calculateStats } from "@/lib/groceryUtils";
import { GroceryItem } from "@/types/grocery";
import { Package, AlertTriangle, Clock, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
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

  const stats = calculateStats(items);
  const recentItems = items.slice(-5).reverse();

  return (
    <Layout onAddItem={() => setDialogOpen(true)}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back!</h2>
          <p className="text-muted-foreground">Here's your grocery overview</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Total Items"
            value={stats.totalItems}
            icon={Package}
            variant="default"
          />
          <StatCard
            title="Shopping List"
            value={stats.shoppingListCount}
            icon={ShoppingBag}
            variant="success"
          />
          <StatCard
            title="Expiring Soon"
            value={stats.expiringSoon}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Expired"
            value={stats.expired}
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {stats.expiringSoon > 0 && (
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <p className="font-semibold text-warning">Items expiring soon!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.expiringSoon} item{stats.expiringSoon > 1 ? "s" : ""} will expire in the next 3 days
                </p>
              </div>
            </div>
          </div>
        )}

        {stats.expired > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="font-semibold text-destructive">Expired items detected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.expired} item{stats.expired > 1 ? "s have" : " has"} expired
                </p>
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Items</h3>
          {recentItems.length > 0 ? (
            <div className="space-y-3">
              {recentItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onDelete={handleDeleteItem}
                  onToggleShoppingList={handleToggleShoppingList}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No items yet. Add your first grocery item!</p>
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

export default Dashboard;
