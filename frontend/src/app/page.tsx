"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Leaf,
  ArrowRight,
  Star,
  Truck,
  Shield,
  Clock,
  ShoppingBag,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Heart,
  BadgePercent,
  ShoppingCart,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { getCategories, getFeaturedProducts, type Category, type Product } from "@/lib/api";

const features = [
  { icon: Truck, title: "Free Delivery", description: "Free delivery on orders above ₹499" },
  { icon: Shield, title: "100% Fresh", description: "Farm-fresh produce guaranteed" },
  { icon: Clock, title: "Same Day", description: "Order before 10 AM for same-day delivery" },
  { icon: Star, title: "Best Prices", description: "Direct from farm, no middlemen" },
];

const trendingCategories = [
  { name: "Vegetables", slug: "vegetables", color: "from-green-400/20 to-green-600/10" },
  { name: "Fruits", slug: "fruits", color: "from-orange-400/20 to-orange-600/10" },
  { name: "Dairy", slug: "dairy-eggs", color: "from-blue-400/20 to-blue-600/10" },
  { name: "Beverages", slug: "beverages", color: "from-cyan-400/20 to-cyan-600/10" },
  { name: "Snacks", slug: "snacks-munchies", color: "from-red-400/20 to-red-600/10" },
  { name: "Bakery", slug: "bakery-bread", color: "from-amber-400/20 to-amber-600/10" },
  { name: "Spices", slug: "spices-seasonings", color: "from-yellow-400/20 to-yellow-600/10" },
  { name: "Meat", slug: "meat-chicken-seafood", color: "from-rose-400/20 to-rose-600/10" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function HomePageContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.categories))
      .catch(() => {});
    getFeaturedProducts()
      .then((res) => setFeaturedProducts(res.products))
      .catch(() => {});
  }, []);

  const catImg = (cat: Category) => {
    if (imageErrors[cat.id]) return null;
    return cat.image;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50/50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=80')] bg-cover bg-center opacity-5" />
        <div className="container mx-auto px-4 py-16 md:py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full">
                <Sparkles className="h-4 w-4" />
                New Season&apos;s Harvest
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-display leading-[1.1]">
                Fresh Groceries{" "}
                <span className="text-primary">Delivered</span>
                <br />
                To Your Doorstep
              </h1>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Shop from 2,000+ fresh products. Free delivery on your first order. 
                Get your groceries in minutes, not hours.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="rounded-full text-base px-8 h-12 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Start Shopping
                  </Button>
                </Link>
                <Link href="/products?category=vegetables">
                  <Button variant="outline" size="lg" className="rounded-full text-base px-8 h-12 border-2">
                    Browse Vegetables
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">12K+</span> happy customers
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1619566626922-71c5935a3e8c?w=600&h=600&fit=crop"
                  alt="Fresh groceries"
                  className="rounded-3xl shadow-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <BadgePercent className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Save upto</p>
                    <p className="font-bold text-lg text-primary">30%</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Free</p>
                    <p className="font-bold text-lg">Delivery</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-gray-100 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-display">
              Shop by Category
            </h2>
            <p className="text-gray-500 mt-1">Find exactly what you need</p>
          </div>
          <Link href="/products">
            <Button variant="ghost" className="hidden sm:flex gap-1 text-primary">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 12).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <Link href={`/products?category=${cat.slug}`}>
                <Card className="overflow-hidden group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                  <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/5 to-muted">
                    <img
                      src={catImg(cat) || ""}
                      alt={cat.name}
                      className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${catImg(cat) ? "" : "opacity-0"}`}
                      onError={() => setImageErrors((prev) => ({ ...prev, [cat.id]: true }))}
                    />
                  </div>
                  <CardContent className="p-3 text-center">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {cat._count?.products || 0} Products
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8 sm:hidden">
          <Link href="/products">
            <Button variant="outline" className="rounded-full gap-1">
              View All Categories <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="bg-gradient-to-r from-green-50 via-white to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold font-display">Trending Now</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {trendingCategories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="snap-start shrink-0"
              >
                <Link href={`/products?category=${cat.slug}`}>
                  <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${cat.color} flex flex-col items-center justify-center gap-1.5 hover:scale-105 transition-transform duration-300 cursor-pointer border border-gray-100/50`}>
                    <div className="h-10 w-10 rounded-full bg-white/80 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-gray-700" />
                    </div>
                    <span className="text-xs font-semibold text-gray-800 text-center px-1">{cat.name}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-secondary" />
                <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Featured</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-display">Top Picks For You</h2>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="hidden sm:flex gap-1 text-primary">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.slice(0, 8).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/products/${product.slug}`}>
                  <Card className="overflow-hidden border-0 shadow-sm group cursor-pointer h-full hover:shadow-xl transition-all duration-300">
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {product.images && product.images[0] && !imageErrors[product.id] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={() => setImageErrors((prev) => ({ ...prev, [product.id]: true }))}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-muted" />
                      )}
                      {product.compareAt && (
                        <Badge variant="success" className="absolute top-3 left-3 text-[10px]">
                          {Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}% OFF
                        </Badge>
                      )}
                      <button
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      >
                        <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                      </button>
                    </div>
                    <CardContent className="p-3 md:p-4">
                      <p className="text-[10px] md:text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                        {product.category?.name || "Grocery"}
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
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Deal Banner */}
      <section className="container mx-auto px-4 pb-16">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80')] bg-cover bg-center opacity-10" />
          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center text-white">
            <Badge variant="secondary" className="bg-white/20 text-white border-0 text-sm px-4 py-1.5 mb-4">
              🎉 Limited Time Offer
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
              Get 20% Off Your First Order
            </h2>
            <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
              Sign up today and enjoy exclusive discounts on your first purchase. 
              Free delivery on orders above ₹499.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="rounded-full bg-white text-primary hover:bg-white/90 text-base px-10 h-12 shadow-xl">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white/10 text-base px-10 h-12">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#111111] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
              Why Choose Groceries?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              We make grocery shopping easy, fast, and affordable
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Free Delivery", desc: "Free delivery on orders above ₹499. No hidden charges." },
              { icon: Shield, title: "Quality Guarantee", desc: "100% fresh products or your money back." },
              { icon: Clock, title: "Express Delivery", desc: "Get your order in 30 minutes or less." },
              { icon: Leaf, title: "Farm Fresh", desc: "Directly sourced from local farms and producers." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Download App CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-green-50 to-orange-50 rounded-3xl p-8 md:p-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Get the Groceries App
              </h2>
              <p className="text-gray-600 mb-6 max-w-md">
                Order on the go! Get exclusive app-only deals, track your delivery in real-time, 
                and enjoy a seamless shopping experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="rounded-full bg-[#111111] hover:bg-[#111111]/90 text-white px-6 gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  App Store
                </Button>
                <Button className="rounded-full bg-[#111111] hover:bg-[#111111]/90 text-white px-6 gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
                  Google Play
                </Button>
              </div>
            </div>
            <div className="hidden md:block text-center">
              <div className="inline-flex items-center justify-center h-48 w-48 rounded-full bg-primary/5">
                <Leaf className="h-24 w-24 text-primary/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-lg font-semibold mb-2">Stay in the Loop</h3>
          <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
            Get weekly updates on new products, deals, and recipes
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-11 px-4 rounded-full border border-gray-200 bg-gray-50 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <Button className="rounded-full h-11 px-6 shrink-0">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return <HomePageContent />;
}
