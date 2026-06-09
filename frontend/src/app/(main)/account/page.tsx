import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Package, MapPin, LogOut } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold font-display mb-8">My Account</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary-light flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Profile</h3>
              <p className="text-sm text-muted-foreground">Manage your personal info</p>
            </div>
          </CardContent>
        </Card>

        <Link href="/orders">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary-light flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Orders</h3>
                <p className="text-sm text-muted-foreground">View your order history</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary-light flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Addresses</h3>
              <p className="text-sm text-muted-foreground">Manage saved addresses</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-red-100 flex items-center justify-center">
              <LogOut className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-red-500">Sign Out</h3>
              <p className="text-sm text-muted-foreground">Log out of your account</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
