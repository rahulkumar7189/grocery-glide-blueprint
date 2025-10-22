import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { storageService } from "@/lib/storage";
import { GroceryItem } from "@/types/grocery";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Package, TrendingUp, Calendar } from "lucide-react";

const COLORS = [
  "hsl(142, 70%, 45%)",
  "hsl(25, 95%, 53%)",
  "hsl(220, 70%, 50%)",
  "hsl(280, 70%, 50%)",
  "hsl(45, 90%, 50%)",
  "hsl(340, 75%, 50%)",
  "hsl(160, 60%, 45%)",
  "hsl(15, 85%, 55%)",
];

const Analytics = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const loadedItems = storageService.getItems();
    setItems(loadedItems);
  };

  const categoryData = items.reduce((acc, item) => {
    const existing = acc.find((d) => d.name === item.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: item.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const totalValue = items.reduce((sum, item) => sum + item.quantity, 0);
  const avgExpiryDays = items
    .filter((item) => item.expiryDate)
    .reduce((sum, item, _, arr) => {
      const days = Math.floor(
        (item.expiryDate!.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return sum + days / arr.length;
    }, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Analytics</h2>
          <p className="text-muted-foreground">Insights into your grocery habits</p>
        </div>

        <div className="grid gap-4">
          <Card className="p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Total Items</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{items.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Across all categories</p>
          </Card>

          <Card className="p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <h3 className="font-semibold text-foreground">Total Quantity</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalValue}</p>
            <p className="text-sm text-muted-foreground mt-1">Items in stock</p>
          </Card>

          {avgExpiryDays !== 0 && (
            <Card className="p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-foreground">Avg. Days Until Expiry</h3>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {Math.max(0, Math.round(avgExpiryDays))}
              </p>
              <p className="text-sm text-muted-foreground mt-1">For items with expiry dates</p>
            </Card>
          )}
        </div>

        {categoryData.length > 0 && (
          <Card className="p-6 shadow-soft">
            <h3 className="font-semibold text-foreground mb-6">Items by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {items.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No data yet</p>
            <p className="text-sm mt-1">Add items to see analytics</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;
