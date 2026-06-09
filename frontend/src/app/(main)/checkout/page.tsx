"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, MapPin, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/cart" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-4">
          <ChevronLeft className="h-4 w-4" /> Back to Cart
        </Link>
        <h1 className="text-3xl font-bold font-display">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Shipping Address */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="font-bold">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Full Name</label>
                  <Input placeholder="John Doe" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium mb-1 block">Address</label>
                  <Input placeholder="123 Main Street, Apt 4B" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">City</label>
                  <Input placeholder="Nashik" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Pincode</label>
                  <Input placeholder="422001" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">State</label>
                  <Input placeholder="Maharashtra" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone</label>
                  <Input placeholder="9876543210" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="font-bold">Payment Method</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                You will be redirected to Razorpay to complete your payment securely.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-bold text-lg">Order Summary</h2>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Product Name × 1</span>
                    <span>₹99.00</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹198.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg text-primary">₹198.00</span>
                </div>
              </div>
              <Button className="w-full rounded-full">
                Pay ₹198.00
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
