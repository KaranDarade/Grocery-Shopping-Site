import Link from "next/link";
import { Leaf, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  shop: [
    { href: "/products?category=vegetables", label: "Vegetables" },
    { href: "/products?category=fruits", label: "Fruits" },
    { href: "/products?category=dairy-eggs", label: "Dairy & Eggs" },
    { href: "/products?category=bakery-bread", label: "Bakery" },
    { href: "/products?category=herbs-spices", label: "Herbs & Spices" },
  ],
  account: [
    { href: "/login", label: "Sign In" },
    { href: "/register", label: "Create Account" },
    { href: "/orders", label: "My Orders" },
    { href: "/cart", label: "Shopping Cart" },
  ],
  support: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/help", label: "Help & FAQ" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#111111] text-white mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-xl font-extrabold font-display">
                <span className="text-primary">Gro</span>
                <span className="text-secondary">ce</span>
                <span className="text-primary">ries</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Your trusted source for fresh, organic groceries delivered straight to your doorstep. 
              We believe in healthy eating made easy.
            </p>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span>College Road, Nashik, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>daradekaran123@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">
              Account
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">
              Support
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Groceries. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
