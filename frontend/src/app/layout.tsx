import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "Groceries - Fresh Organic Food Delivered",
    template: "%s | Groceries",
  },
  description: "Your trusted source for fresh, organic groceries delivered straight to your doorstep. Shop from 2000+ products with free delivery.",
  keywords: ["grocery", "organic", "fresh food", "online grocery", "food delivery", "vegetables", "fruits"],
  openGraph: {
    title: "Groceries - Fresh Organic Food Delivered",
    description: "Shop fresh organic groceries online with free delivery.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-white">
        <AuthProvider>
            <Navbar />
            <main className="pt-16">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <Toaster richColors closeButton />
          </AuthProvider>
      </body>
    </html>
  );
}
