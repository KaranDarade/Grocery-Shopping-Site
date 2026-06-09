import Link from "next/link";
import { Leaf, ArrowRight, Star, Truck, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  { name: "Vegetables", slug: "vegetables", count: 50, image: "https://images.unsplash.com/photo-1566385101042-1a0aa68c5e47?w=400&h=400&fit=crop" },
  { name: "Fruits", slug: "fruits", count: 50, image: "https://images.unsplash.com/photo-1619566626922-71c5935a3e8c?w=400&h=400&fit=crop" },
  { name: "Dairy & Eggs", slug: "dairy-eggs", count: 50, image: "https://images.unsplash.com/photo-1628088062854-b1870b1f6b9f?w=400&h=400&fit=crop" },
  { name: "Bakery", slug: "bakery-bread", count: 50, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop" },
  { name: "Spices", slug: "herbs-spices", count: 50, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop" },
];

const features = [
  { icon: Truck, title: "Free Delivery", description: "Free delivery on orders above ₹499" },
  { icon: Shield, title: "100% Fresh", description: "Farm-fresh produce guaranteed" },
  { icon: Clock, title: "Same Day", description: "Order before 10 AM for same-day delivery" },
  { icon: Star, title: "Best Prices", description: "Direct from farm, no middlemen" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <Badge variant="success" className="text-sm px-4 py-1.5">
                🎉 New Season&apos;s Harvest
              </Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold font-display leading-tight text-balance">
                Fresh Organic Food{" "}
                <span className="text-primary">For Your Health</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Discover the finest selection of organic fruits, vegetables, dairy, and more. 
                Delivered fresh from local farms to your doorstep.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="rounded-full text-base px-8">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products?category=vegetables">
                  <Button variant="outline" size="lg" className="rounded-full text-base px-8">
                    Browse Vegetables
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop"
                  alt="Fresh organic vegetables"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-b border-border/40">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
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

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Browse our wide selection of fresh organic products
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`}>
              <Card className="overflow-hidden group cursor-pointer border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{cat.count} Products</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4 pb-16">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary/90 to-primary-hover/90">
          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Get 20% Off Your First Order
            </h2>
            <p className="text-white/80 max-w-lg mx-auto mb-8">
              Sign up today and enjoy exclusive discounts on your first purchase. 
              Fresh groceries delivered to your doorstep.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="rounded-full bg-white text-primary hover:bg-white/90 text-base px-8">
                  Create Account
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white/10 text-base px-8">
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
