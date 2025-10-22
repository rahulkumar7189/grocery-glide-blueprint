import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Package, ShoppingCart, BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
  onAddItem?: () => void;
}

const Layout = ({ children, onAddItem }: LayoutProps) => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/inventory", icon: Package, label: "Inventory" },
    { path: "/shopping", icon: ShoppingCart, label: "Shopping" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 w-full border-b bg-card shadow-soft backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">FreshKeeper</h1>
          </div>
        </div>
      </header>

      <main className="container py-6">{children}</main>

      {onAddItem && (
        <Button
          onClick={onAddItem}
          size="lg"
          className="fixed bottom-20 right-6 h-14 w-14 rounded-full bg-gradient-primary shadow-large hover:shadow-large hover:scale-105 transition-all"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card shadow-large">
        <div className="container flex h-16 items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
