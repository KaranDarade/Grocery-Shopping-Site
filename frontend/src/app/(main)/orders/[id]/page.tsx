import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Package, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";

export default function OrderDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/orders" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-6">
        <ChevronLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display mb-1">ORD-001</h1>
          <p className="text-sm text-muted-foreground">Placed on June 9, 2024</p>
        </div>
        <Badge variant="success" className="text-sm px-4 py-1.5">Delivered</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Items
          </h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-4 flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-muted shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">Product Name</h3>
                    <p className="text-xs text-muted-foreground">Qty: 1 × ₹99.00</p>
                    <p className="font-semibold text-sm text-primary mt-1">₹99.00</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 space-y-4">
              <h2 className="font-bold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Shipping Address
              </h2>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">John Doe</p>
                <p>123 Main Street, Apt 4B</p>
                <p>Nashik, Maharashtra 422001</p>
                <p>Phone: 9876543210</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 space-y-3">
              <h2 className="font-bold">Payment Summary</h2>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹297.00</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-green-600">Free</span></div>
                <div className="border-t pt-2 flex justify-between font-bold"><span>Total</span><span className="text-primary">₹297.00</span></div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600 pt-2">
                <CreditCard className="h-4 w-4" />
                Paid via Razorpay
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
