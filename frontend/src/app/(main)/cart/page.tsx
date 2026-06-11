"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/utils";
import { getCart, updateCartItem, removeCartItem, type CartItem } from "@/lib/api";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

function CartSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex gap-4 animate-pulse">
              <div className="w-20 h-20 rounded-xl bg-muted shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="flex items-center justify-between">
                  <div className="h-5 w-16 bg-muted rounded" />
                  <div className="h-7 w-28 bg-muted rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const fetchCart = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await getCart();
      setItems(res.items);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) fetchCart();
  }, [user, authLoading, router, fetchCart]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);
  const delivery = subtotal > 499 ? 0 : 49;
  const total = subtotal + delivery;

  const handleQtyChange = useCallback((item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i)));

    const existing = debounceTimers.current.get(item.id);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(async () => {
      setUpdating(item.id);
      try {
        await updateCartItem(item.id, newQty);
        toast.success("Cart updated");
      } catch {
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, quantity: item.quantity } : i)));
        toast.error("Failed to update quantity");
      } finally {
        setUpdating(null);
      }
    }, 400);

    debounceTimers.current.set(item.id, timer);
  }, []);

  useEffect(() => {
    return () => {
      debounceTimers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const handleDelete = useCallback(async (item: CartItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    try {
      await removeCartItem(item.id);
      toast.success("Item removed from cart");
    } catch {
      setItems((prev) => [...prev, item]);
      toast.error("Failed to remove item");
    }
  }, []);

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-display">Shopping Cart</h1>
        {!loading && !error && (
          <span className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {loading ? (
            <CartSkeleton />
          ) : error ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Oops! Something went wrong</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchCart} variant="outline" className="rounded-full">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : items.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="h-16 w-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Looks like you have not added anything to your cart yet.
                </p>
                <Link href="/products">
                  <Button className="rounded-full">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Start Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div key={item.id} variants={itemVariants} exit="exit" layout>
                    <Card className="overflow-hidden border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-xl shrink-0 overflow-hidden bg-muted">
                            {item.product.images?.[0] ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary-light to-muted flex items-center justify-center">
                                <ShoppingBag className="h-6 w-6 text-muted-foreground/40" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-sm">{item.product.name}</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">{item.product.unit}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 -mt-1 -mr-1 shrink-0"
                                onClick={() => handleDelete(item)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="font-bold text-primary">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="rounded-full h-7 w-7"
                                  disabled={item.quantity <= 1 || updating === item.id}
                                  onClick={() => handleQtyChange(item, -1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm font-semibold w-6 text-center">
                                  {updating === item.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin mx-auto" />
                                  ) : (
                                    item.quantity
                                  )}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="rounded-full h-7 w-7"
                                  disabled={updating === item.id}
                                  onClick={() => handleQtyChange(item, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-bold text-lg">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  {delivery === 0 ? (
                    <span className="text-green-600 font-semibold">Free</span>
                  ) : (
                    <span className="font-semibold">{formatPrice(delivery)}</span>
                  )}
                </div>
                {delivery > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Free delivery on orders above {formatPrice(499)}
                  </p>
                )}
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg text-primary">{formatPrice(total)}</span>
                </div>
              </div>
              <Link href="/checkout">
                <Button
                  className="w-full rounded-full gap-2"
                  disabled={items.length === 0}
                >
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
