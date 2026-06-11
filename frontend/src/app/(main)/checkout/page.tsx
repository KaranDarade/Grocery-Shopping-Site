"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Truck, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { getCart, createOrder } from "@/lib/api";
import type { CartItem } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { jsPDF } from "jspdf";

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<{ items: CartItem[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    const saved = localStorage.getItem("shippingAddress");
    if (saved) try { setAddress(JSON.parse(saved)); } catch {}
    loadCart();
  }, [user]);

  async function loadCart() {
    try {
      const data = await getCart();
      setCart(data);
    } catch { setCart({ items: [] });
    } finally { setLoading(false); }
  }

  const subtotal = cart?.items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0) || 0;
  const deliveryFee = subtotal >= 499 ? 0 : 40;
  const total = subtotal + deliveryFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    localStorage.setItem("shippingAddress", JSON.stringify(address));
    try {
      const res = await createOrder({
        shippingAddress: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
      });
      setOrderId(res.order.id);
      setSuccess(true);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  function downloadReceipt() {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Order Receipt", 20, 30);
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderId}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
    doc.text(`Name: ${address.fullName}`, 20, 75);
    doc.text(`Phone: ${address.phone}`, 20, 85);
    doc.text(`Address: ${address.street}, ${address.city}, ${address.state} - ${address.pincode}`, 20, 95);
    doc.text(`Total: ${formatPrice(total)}`, 20, 115);
    doc.text("Items:", 20, 130);
    let y = 140;
    cart?.items.forEach((item) => {
      doc.text(`${item.product.name} x${item.quantity} - ${formatPrice(Number(item.product.price) * item.quantity)}`, 20, y);
      y += 10;
    });
    doc.save(`receipt-${orderId}.pdf`);
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading checkout...</div>;
  if (success) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold font-display mb-2">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-2">Your order <span className="font-mono text-sm">#{orderId?.slice(-8)}</span> has been placed.</p>
        <p className="text-muted-foreground mb-6">You will receive a confirmation shortly.</p>
        <div className="flex gap-3 justify-center">
          <Button className="rounded-full" onClick={() => router.push("/orders")}>View Orders</Button>
          <Button variant="outline" className="rounded-full" onClick={downloadReceipt}>Download Receipt</Button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold font-display mb-8">Checkout</h1>
      <div className="grid md:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Shipping Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Label>Full Name</Label><Input required value={address.fullName} onChange={e => setAddress(a => ({...a, fullName: e.target.value}))} placeholder="John Doe" /></div>
              <div className="col-span-2"><Label>Phone</Label><Input required value={address.phone} onChange={e => setAddress(a => ({...a, phone: e.target.value}))} placeholder="9876543210" /></div>
              <div className="col-span-2"><Label>Street Address</Label><Textarea required value={address.street} onChange={e => setAddress(a => ({...a, street: e.target.value}))} placeholder="123 Main St" /></div>
              <div><Label>City</Label><Input required value={address.city} onChange={e => setAddress(a => ({...a, city: e.target.value}))} placeholder="Mumbai" /></div>
              <div><Label>State</Label><Input required value={address.state} onChange={e => setAddress(a => ({...a, state: e.target.value}))} placeholder="Maharashtra" /></div>
              <div><Label>Pincode</Label><Input required value={address.pincode} onChange={e => setAddress(a => ({...a, pincode: e.target.value}))} placeholder="400001" /></div>
            </div>
          </div>
          <Button type="submit" disabled={submitting || !cart?.items.length} className="w-full rounded-full h-12 text-base gap-2">
            <CreditCard className="h-4 w-4" />
            {submitting ? "Placing Order..." : `Place Order • ${formatPrice(total)}`}
          </Button>
        </form>
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border sticky top-24">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart?.items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex-shrink-0 overflow-hidden">
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold">{formatPrice(Number(item.product.price) * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{deliveryFee === 0 ? <span className="text-primary">FREE</span> : formatPrice(deliveryFee)}</span></div>
              <div className="flex justify-between font-semibold text-base border-t pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
