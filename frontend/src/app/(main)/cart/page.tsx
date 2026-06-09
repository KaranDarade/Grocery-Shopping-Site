import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-display">Shopping Cart</h1>
        <span className="text-sm text-muted-foreground">2 items</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {[1, 2].map((item) => (
            <Card key={item} className="overflow-hidden border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl bg-muted shrink-0 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-primary-light to-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">Product Name</h3>
                    <p className="text-xs text-muted-foreground mb-2">1 KG</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">₹99.00</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="rounded-full h-7 w-7">
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-semibold w-6 text-center">1</span>
                        <Button variant="outline" size="icon" className="rounded-full h-7 w-7">
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-bold text-lg">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹198.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg text-primary">₹198.00</span>
                </div>
              </div>
              <Link href="/checkout">
                <Button className="w-full rounded-full gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="ghost" className="w-full gap-2 text-sm">
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
