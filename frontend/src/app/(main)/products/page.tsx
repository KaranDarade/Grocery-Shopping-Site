"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import {
  getProducts,
  getCategories,
  type Product,
  type Category,
  type PaginationInfo,
} from "@/lib/api";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A-Z" },
  { value: "name-desc", label: "Name: Z-A" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function SkeletonCard() {
  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <div className="aspect-square bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-2">
        <div className="h-3 w-16 bg-muted animate-pulse rounded-full" />
        <div className="h-4 w-full bg-muted animate-pulse rounded" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 w-20 bg-muted animate-pulse rounded" />
          <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === "" ||
          value === "all" ||
          (key === "sort" && value === "newest")
        ) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      if (!("page" in updates)) {
        params.delete("page");
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      if (searchInput !== search) {
        updateFilters({ search: searchInput });
      }
    }, 300);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchInput]);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string | number | undefined> = {
          page,
          limit: 12,
        };
        if (search) params.search = search;
        if (category !== "all") params.category = category;
        if (sort !== "newest") params.sort = sort;
        if (minPrice) params.minPrice = Number(minPrice);
        if (maxPrice) params.maxPrice = Number(maxPrice);
        const data = await getProducts(params);
        if (!cancelled) {
          setProducts(data.products);
          setPagination(data.pagination);
        }
      } catch {
        if (!cancelled) setError("Failed to load products. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [category, sort, page, search, minPrice, maxPrice]);

  const handleCategoryClick = (slug: string) => {
    updateFilters({ category: slug });
  };

  const handlePriceBlur = () => {
    if (minPriceInput !== minPrice || maxPriceInput !== maxPrice) {
      updateFilters({ minPrice: minPriceInput, maxPrice: maxPriceInput });
    }
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePriceBlur();
    }
  };

  const startItem = (page - 1) * pagination.limit + 1;
  const endItem = Math.min(page * pagination.limit, pagination.total);

  const renderProductGrid = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      key={`${category}-${sort}-${page}-${search}-${minPrice}-${maxPrice}`}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <Link href={`/products/${product.slug}`}>
            <Card className="overflow-hidden border-0 shadow-sm group cursor-pointer h-full">
              <div className="aspect-square bg-muted relative overflow-hidden">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (
                        e.target as HTMLImageElement
                      ).parentElement!.classList.add(
                        "bg-gradient-to-br",
                        "from-primary/10",
                        "to-muted"
                      );
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-muted" />
                )}
                {product.compareAt && (
                  <Badge
                    variant="success"
                    className="absolute top-3 left-3 text-[10px]"
                  >
                    Sale
                  </Badge>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>
              <CardContent className="p-3 md:p-4">
                <p className="text-[10px] md:text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                  {product.category.name}
                </p>
                <h3 className="font-semibold text-sm mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-sm md:text-base text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAt && (
                      <span className="text-[10px] md:text-xs text-muted-foreground line-through">
                        {formatPrice(product.compareAt)}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full h-8 w-8 p-0 shrink-0 border-primary/20 text-primary hover:bg-primary hover:text-white hover:border-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderSkeletons = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold font-display mb-1">
        No products found
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        {search
          ? `No results for "${search}". Try a different search term.`
          : "Try adjusting your filters or browse all products."}
      </p>
      {(search ||
        category !== "all" ||
        minPrice ||
        maxPrice ||
        sort !== "newest") && (
        <Button
          variant="outline"
          size="sm"
          className="rounded-full mt-4"
          onClick={() => {
            setSearchInput("");
            router.replace(pathname, { scroll: false });
          }}
        >
          Clear all filters
        </Button>
      )}
    </div>
  );

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <SlidersHorizontal className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold font-display mb-1">
        Something went wrong
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-4">{error}</p>
      <Button
        variant="default"
        size="sm"
        className="rounded-full"
        onClick={() => window.location.reload()}
      >
        Try again
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-display mb-1">
          All Products
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Discover our fresh organic selection
        </p>
      </div>

      {/* Filters Bar */}
      <div className="space-y-4 mb-8">
        {/* Search + Mobile filter toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 bg-muted/50 border-none rounded-full h-10"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 lg:hidden shrink-0"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop filters */}
        <div className="hidden lg:flex flex-wrap items-center gap-3">
          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => handleCategoryClick("all")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-200 border",
                category === "all"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-muted-foreground border-input hover:border-primary/50 hover:text-primary"
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-200 border",
                  category === cat.slug
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-muted-foreground border-input hover:border-primary/50 hover:text-primary"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="h-9 rounded-full border border-input bg-white px-3 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Price range */}
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              onBlur={handlePriceBlur}
              onKeyDown={handlePriceKeyDown}
              className="w-20 h-9 rounded-full text-sm px-3 bg-muted/50 border-none"
            />
            <span className="text-muted-foreground text-xs">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              onBlur={handlePriceBlur}
              onKeyDown={handlePriceKeyDown}
              className="w-20 h-9 rounded-full text-sm px-3 bg-muted/50 border-none"
            />
          </div>
        </div>

        {/* Mobile filters */}
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden space-y-3 p-4 bg-muted/30 rounded-xl"
          >
            {/* Category pills */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryClick("all")}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-full border transition-all",
                    category === "all"
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-muted-foreground border-input"
                  )}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded-full border transition-all",
                      category === cat.slug
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-muted-foreground border-input"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Sort by
              </p>
              <select
                value={sort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="w-full h-9 rounded-full border border-input bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Price range
              </p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  onBlur={handlePriceBlur}
                  onKeyDown={handlePriceKeyDown}
                  className="flex-1 h-9 rounded-full text-sm bg-white"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  onBlur={handlePriceBlur}
                  onKeyDown={handlePriceKeyDown}
                  className="flex-1 h-9 rounded-full text-sm bg-white"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Active filters summary */}
      {(search || category !== "all" || minPrice || maxPrice) && (
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {search && (
            <Badge variant="secondary" className="text-xs gap-1">
              "{search}"
              <button
                onClick={() => {
                  setSearchInput("");
                  updateFilters({ search: "" });
                }}
              >
                <span className="ml-1 hover:text-foreground">&times;</span>
              </button>
            </Badge>
          )}
          {category !== "all" && (
            <Badge variant="secondary" className="text-xs gap-1">
              {categories.find((c) => c.slug === category)?.name || category}
              <button onClick={() => updateFilters({ category: "all" })}>
                <span className="ml-1 hover:text-foreground">&times;</span>
              </button>
            </Badge>
          )}
          {(minPrice || maxPrice) && (
            <Badge variant="secondary" className="text-xs">
              ₹{minPrice || "0"} - ₹{maxPrice || "∞"}
              <button onClick={() => updateFilters({ minPrice: "", maxPrice: "" })}>
                <span className="ml-1 hover:text-foreground">&times;</span>
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Content */}
      {loading && renderSkeletons()}
      {error && renderErrorState()}
      {!loading && !error && products.length === 0 && renderEmptyState()}
      {!loading && !error && products.length > 0 && (
        <>
          {renderProductGrid()}
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {startItem}-{endItem} of {pagination.total} products
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-9 w-9"
                  disabled={page <= 1}
                  onClick={() => updateFilters({ page: String(page - 1) })}
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
                      onClick={() =>
                        updateFilters({ page: String(pageNum) })
                      }
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
                  onClick={() => updateFilters({ page: String(page + 1) })}
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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 md:mb-8">
            <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mb-2" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
