"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Share2,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import { getProductBySlug, type Product } from "@/lib/api";

function ProductDetailContent() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const { product } = await getProductBySlug(slug);
        if (!cancelled) setProduct(product);
      } catch (err: any) {
        if (!cancelled) {
          if (err?.response?.status === 404) {
            setNotFound(true);
          } else {
            setError("Failed to load product. Please try again.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const discountPercentage =
    product?.compareAt && product.compareAt > product.price
      ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
      : null;

  const incrementQuantity = () => {
    if (product && quantity < product.stock) setQuantity((q) => q + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square rounded-2xl bg-muted animate-pulse" />
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-4 w-24 bg-muted animate-pulse rounded-full" />
              <div className="h-8 w-3/4 bg-muted animate-pulse rounded-lg" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-28 bg-muted animate-pulse rounded-lg" />
              <div className="h-6 w-20 bg-muted animate-pulse rounded-lg" />
              <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4/6 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-40 bg-muted animate-pulse rounded" />
            <div className="flex items-center gap-4">
              <div className="h-9 w-28 bg-muted animate-pulse rounded-full" />
              <div className="h-12 w-44 bg-muted animate-pulse rounded-full" />
              <div className="h-12 w-12 bg-muted animate-pulse rounded-full" />
              <div className="h-12 w-12 bg-muted animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-display mb-2">
            Product not found
          </h1>
          <p className="text-muted-foreground mb-6">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link href="/products">
            <Button className="rounded-full px-8">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold font-display mb-2">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <Button
              className="rounded-full px-8"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
            <Link href="/products">
              <Button variant="outline" className="rounded-full px-8">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const mainImage =
    !imageError && product.images && product.images[0]
      ? product.images[0]
      : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-muted relative group">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-muted to-secondary/10" />
          )}
          {discountPercentage && (
            <Badge
              variant="success"
              className="absolute top-4 left-4 text-sm px-3 py-1"
            >
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/products"
              className="hover:text-primary transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-primary transition-colors"
            >
              {product.category.name}
            </Link>
          </div>

          {/* Name */}
          <h1 className="text-2xl md:text-3xl font-bold font-display leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.compareAt && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compareAt)}
                </span>
                {discountPercentage && (
                  <Badge variant="success" className="text-xs">
                    Save {discountPercentage}%
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Unit */}
          <div className="text-sm">
            <span className="font-semibold text-foreground">Unit: </span>
            <span className="text-muted-foreground">{product.unit}</span>
          </div>

          {/* Stock */}
          <div className="text-sm">
            <span className="font-semibold text-foreground">
              Availability:{" "}
            </span>
            {product.isAvailable && product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-green-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                In Stock ({product.stock} {product.unit})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-red-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                Out of Stock
              </span>
            )}
          </div>

          {/* Quantity selector */}
          {product.isAvailable && product.stock > 0 && (
            <div className="flex items-center gap-4">
              <span className="font-semibold text-sm">Quantity:</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  disabled={quantity <= 1}
                  onClick={decrementQuantity}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-lg w-10 text-center tabular-nums">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  disabled={quantity >= product.stock}
                  onClick={incrementQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Button
              size="lg"
              className="rounded-full px-8 md:px-10 gap-2 h-12"
              disabled={!product.isAvailable || product.stock === 0}
            >
              <ShoppingBag className="h-5 w-5" />
              {product.isAvailable && product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 border-muted-foreground/20 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 border-muted-foreground/20"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: product.name,
                    text: product.description || undefined,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="aspect-square rounded-2xl bg-muted animate-pulse" />
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="h-4 w-24 bg-muted animate-pulse rounded-full" />
                <div className="h-8 w-3/4 bg-muted animate-pulse rounded-lg" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-8 w-28 bg-muted animate-pulse rounded-lg" />
                <div className="h-6 w-20 bg-muted animate-pulse rounded-lg" />
                <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4/6 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-40 bg-muted animate-pulse rounded" />
              <div className="flex items-center gap-4">
                <div className="h-9 w-28 bg-muted animate-pulse rounded-full" />
                <div className="h-12 w-44 bg-muted animate-pulse rounded-full" />
                <div className="h-12 w-12 bg-muted animate-pulse rounded-full" />
                <div className="h-12 w-12 bg-muted animate-pulse rounded-full" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
