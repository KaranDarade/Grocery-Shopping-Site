import { Search, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = ["All", "Vegetables", "Fruits", "Dairy & Eggs", "Bakery", "Spices"];

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display mb-2">All Products</h1>
        <p className="text-gray-600">Discover our fresh organic selection</p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 bg-muted/50 rounded-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9 bg-white" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={cat === "All" ? "default" : "outline"}
              size="sm"
              className="rounded-full whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border-0 shadow-sm hover:shadow-lg">
            <div className="aspect-square bg-muted relative overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary-light to-muted animate-pulse" />
              <Badge variant="success" className="absolute top-3 left-3">New</Badge>
            </div>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Vegetables</p>
              <h3 className="font-semibold text-sm mb-2 line-clamp-1">Product Name</h3>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-primary">₹99.00</span>
                  <span className="text-xs text-muted-foreground line-through ml-2">₹129.00</span>
                </div>
                <Button size="sm" variant="outline" className="rounded-full h-8 w-8 p-0">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
