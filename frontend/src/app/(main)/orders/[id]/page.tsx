"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, Package, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatPrice } from "@/lib/utils";
import { getOrderById, type Order } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const paymentStatusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-blue-100 text-blue-800",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

function renderAddress(address: any) {
  if (!address) return null;
  const lines = [
    address.fullName || address.name,
    address.street || address.address,
    [address.city, address.state].filter(Boolean).join(", "),
    address.pincode || address.zipCode,
    address.phone ? `Phone: ${address.phone}` : null,
  ].filter(Boolean);
  return lines.map((line, i) => <p key={i}>{line}</p>);
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (authLoading || !user || !params.id) return;
    let cancelled = false;
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const data = await getOrderById(params.id as string);
        if (!cancelled) setOrder(data.order);
      } catch (err: any) {
        if (!cancelled) {
          if (err?.response?.status === 404) {
            setNotFound(true);
          } else {
            setError("Failed to load order details. Please try again.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [params.id, authLoading, user]);

  if (authLoading || !user) return null;

  const subtotal =
    order?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const deliveryFee = order && order.total > subtotal ? order.total - subtotal : 0;

  const renderSkeleton = () => (
    <div className="space-y-6">
      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-36 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4 flex gap-4">
                <div className="w-16 h-16 rounded-xl bg-muted animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 space-y-3">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-muted animate-pulse rounded" />
                <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 space-y-3">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-3 w-full bg-muted animate-pulse rounded" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderNotFound = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <Package className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold font-display mb-1">Order not found</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-4">
        This order doesn&apos;t exist or has been removed.
      </p>
      <Link href="/orders">
        <Button className="rounded-full">Back to Orders</Button>
      </Link>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <Package className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold font-display mb-1">Something went wrong</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-4">{error}</p>
      <Button className="rounded-full" onClick={() => window.location.reload()}>
        Try again
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {renderSkeleton()}
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {renderNotFound()}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {renderError()}
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/orders"
        className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display mb-1">
              #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-sm text-muted-foreground">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              className={cn("text-sm px-4 py-1.5 font-medium", statusStyles[order.status] || "")}
            >
              {order.status}
            </Badge>
            <Badge
              className={cn(
                "text-sm px-4 py-1.5 font-medium",
                paymentStatusStyles[order.paymentStatus] || ""
              )}
            >
              {order.paymentStatus}
            </Badge>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={itemVariants}>
              <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-primary" />
                Items ({order.items.length})
              </h2>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <Card key={item.id} className="border-0 shadow-sm">
                    <CardContent className="p-3 md:p-4 flex gap-3 md:gap-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-muted shrink-0 overflow-hidden">
                        {item.product.images && item.product.images[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-sm md:text-base">
                              {item.product.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {item.product.unit} &middot; Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="font-bold text-sm md:text-base text-primary shrink-0">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            {order.shippingAddress && (
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-5 space-y-3">
                    <h2 className="font-bold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Shipping Address
                    </h2>
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      {renderAddress(order.shippingAddress)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <h2 className="font-bold">Payment Summary</h2>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                        {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <h3 className="text-sm font-semibold flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-primary" />
                      Payment Status
                    </h3>
                    <Badge
                      className={cn(
                        "text-[10px]",
                        paymentStatusStyles[order.paymentStatus] || ""
                      )}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
