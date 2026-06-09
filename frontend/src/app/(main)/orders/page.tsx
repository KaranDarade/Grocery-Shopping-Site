import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ChevronRight } from "lucide-react";
import Link from "next/link";

const orders = [
  { id: "ORD-001", date: "2024-06-09", total: 450, status: "delivered", items: 5 },
  { id: "ORD-002", date: "2024-06-07", total: 230, status: "shipped", items: 3 },
  { id: "ORD-003", date: "2024-06-05", total: 120, status: "pending", items: 2 },
];

const statusVariant = {
  pending: "warning" as const,
  confirmed: "default" as const,
  preparing: "default" as const,
  shipped: "default" as const,
  delivered: "success" as const,
  cancelled: "destructive" as const,
};

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Package className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-display">My Orders</h1>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold">{order.id}</h3>
                    <Badge variant={statusVariant[order.status as keyof typeof statusVariant]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    {" · "}
                    {order.items} items
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-primary">₹{order.total}.00</span>
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
