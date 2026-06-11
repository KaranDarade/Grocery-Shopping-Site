"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ChevronRight, ChevronLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import { getOrders, type Order, type PaginationInfo } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
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

function SkeletonCard() {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <div className="h-5 w-24 bg-muted animate-pulse rounded" />
              <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
            </div>
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-5 w-16 bg-muted animate-pulse rounded" />
            <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrders({ page, limit: 10 });
        if (!cancelled) {
          setOrders(data.orders);
          setPagination(data.pagination);
        }
      } catch {
        if (!cancelled) setError("Failed to load orders. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchOrders();
    return () => {
      cancelled = true;
    };
  }, [page, authLoading, user]);

  if (authLoading || !user) return null;

  const startItem = (page - 1) * pagination.limit + 1;
  const endItem = Math.min(page * pagination.limit, pagination.total);

  const renderSkeletons = () => (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold font-display mb-1">No orders yet</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-4">
        Looks like you haven&apos;t placed any orders yet. Start shopping!
      </p>
      <Link href="/products">
        <Button className="rounded-full">Browse Products</Button>
      </Link>
    </div>
  );

  const renderErrorState = () => (
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Package className="h-8 w-8 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold font-display">My Orders</h1>
      </div>

      {loading && renderSkeletons()}
      {error && renderErrorState()}
      {!loading && !error && orders.length === 0 && renderEmptyState()}
      {!loading && !error && orders.length > 0 && (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {orders.map((order) => (
              <motion.div key={order.id} variants={itemVariants}>
                <Link href={`/orders/${order.id}`}>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                            <h3 className="font-bold text-sm md:text-base">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </h3>
                            <Badge
                              className={cn(
                                "text-[10px] md:text-xs font-medium",
                                statusStyles[order.status] || ""
                              )}
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                            {" · "}
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "item" : "items"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4 shrink-0">
                          <span className="font-bold text-sm md:text-base text-primary">
                            {formatPrice(order.total)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-8 w-8 md:h-10 md:w-10 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {startItem}-{endItem} of {pagination.total} orders
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-9 w-9"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({
                  length: Math.min(pagination.totalPages, 5),
                }).map((_, i) => {
                  let pageNum: number;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="icon"
                      className={cn(
                        "rounded-full h-9 w-9 text-sm",
                        page === pageNum && "bg-primary text-white"
                      )}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-9 w-9"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
