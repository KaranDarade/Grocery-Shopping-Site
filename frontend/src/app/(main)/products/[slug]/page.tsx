import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingBag, Heart, Share2 } from "lucide-react";

export default function ProductDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square rounded-2xl bg-muted overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-primary-light to-muted" />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Vegetables</p>
            <h1 className="text-3xl font-bold font-display">Product Name</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">₹99.00</span>
            <span className="text-lg text-muted-foreground line-through">₹129.00</span>
            <Badge variant="success">23% OFF</Badge>
          </div>

          <p className="text-gray-600 leading-relaxed">
            Fresh and high-quality product sourced directly from local farms. Perfect for your daily cooking needs.
          </p>

          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Unit:</span> 1 KG
          </div>

          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Availability:</span>{" "}
            <span className="text-green-600">In Stock</span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="font-semibold text-sm">Quantity:</span>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-semibold w-8 text-center">1</span>
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" className="rounded-full px-10 gap-2">
              <ShoppingBag className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
