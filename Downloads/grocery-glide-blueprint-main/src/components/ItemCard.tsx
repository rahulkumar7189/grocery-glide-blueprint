import { GroceryItem } from "@/types/grocery";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ShoppingCart, Calendar, Package2 } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { getExpiryStatus, getExpiryColor } from "@/lib/groceryUtils";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  item: GroceryItem;
  onDelete: (id: string) => void;
  onToggleShoppingList: (id: string) => void;
}

const ItemCard = ({ item, onDelete, onToggleShoppingList }: ItemCardProps) => {
  const expiryStatus = getExpiryStatus(item.expiryDate);
  const daysUntilExpiry = item.expiryDate ? differenceInDays(item.expiryDate, new Date()) : null;

  return (
    <Card className="p-4 shadow-soft transition-all hover:shadow-medium">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground">{item.name}</h3>
            {item.isInShoppingList && (
              <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30">
                In List
              </Badge>
            )}
          </div>
          
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package2 className="h-4 w-4" />
              <span>{item.category}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium">{item.quantity} {item.unit}</span>
            </div>

            {item.expiryDate && (
              <div className={cn("flex items-center gap-2", getExpiryColor(expiryStatus))}>
                <Calendar className="h-4 w-4" />
                <span>
                  {expiryStatus === "expired" 
                    ? `Expired ${Math.abs(daysUntilExpiry!)} days ago`
                    : expiryStatus === "expiring"
                    ? `Expires in ${daysUntilExpiry} days`
                    : `Expires ${format(item.expiryDate, "MMM d, yyyy")}`
                  }
                </span>
              </div>
            )}

            {item.notes && (
              <p className="text-xs text-muted-foreground mt-2 italic">{item.notes}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onToggleShoppingList(item.id)}
            className={cn(
              "h-8 w-8 p-0",
              item.isInShoppingList && "bg-accent/10 text-accent border-accent/30"
            )}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(item.id)}
            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
