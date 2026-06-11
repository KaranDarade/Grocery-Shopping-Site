"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, MapPin, ChevronLeft, ShoppingBag, Loader2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/utils";
import { getCart, createOrder, createRazorpayOrder, verifyPayment, type CartItem } from "@/lib/api";
import { toast } from "sonner";

const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  pincode: z
    .string()
    .min(1, "Pincode is required")
    .regex(/^\d{6}$/, "Invalid pincode"),
  state: z.string().min(1, "State is required"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^\d{10}$/, "Invalid phone number"),
});

type AddressForm = z.infer<typeof addressSchema>;

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: user?.name || "",
      phone: user?.phone || "",
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      getCart()
        .then((res) => {
          if (res.items.length === 0) {
            router.push("/cart");
            return;
          }
          setItems(res.items);
        })
        .catch((err) => setError(err?.response?.data?.message || "Failed to load cart"))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);
  const delivery = subtotal > 499 ? 0 : 49;
  const total = subtotal + delivery;

  const handlePlaceOrder = useCallback(
    async (address: AddressForm) => {
      setPlacing(true);
      try {
        setStep("Creating order...");
        const orderRes = await createOrder();
        const order = orderRes.order;

        setStep("Initializing payment...");
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error("Failed to load payment gateway");
          setPlacing(false);
          return;
        }

        const paymentData = await createRazorpayOrder(order.id);

        localStorage.setItem("shippingAddress", JSON.stringify(address));

        const options = {
          key: paymentData.keyId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          name: "Groceries",
          description: `Order #${order.id.slice(0, 8)}`,
          order_id: paymentData.razorpayOrderId,
          handler: async function (response: any) {
            setStep("Verifying payment...");
            try {
              const verifyRes = await verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              toast.success("Payment successful!");
              router.push(`/orders/${verifyRes.order.id}`);
            } catch {
              toast.error("Payment verification failed. Please contact support.");
              setPlacing(false);
              setStep("");
            }
          },
          prefill: {
            name: address.fullName,
            email: user?.email || "",
            contact: address.phone,
          },
          theme: {
            color: "#3CB815",
          },
          modal: {
            ondismiss: function () {
              setPlacing(false);
              setStep("");
              toast.error("Payment cancelled");
            },
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to place order");
        setPlacing(false);
        setStep("");
      }
    },
    [router, user]
  );

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 animate-pulse">
          <div className="h-4 w-24 bg-muted rounded mb-4" />
          <div className="h-9 w-48 bg-muted rounded" />
        </div>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {[1, 2].map((i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-4 animate-pulse">
                  <div className="h-6 w-40 bg-muted rounded" />
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <div key={j} className={`h-10 bg-muted rounded-lg ${j <= 2 ? "col-span-2" : ""}`} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Failed to load checkout</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.refresh()} variant="outline" className="rounded-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link
          href="/cart"
          className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-4"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Cart
        </Link>
        <h1 className="text-3xl font-bold font-display">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit(handlePlaceOrder)}>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="font-bold">Shipping Address</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm font-medium mb-1 block">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Input placeholder="John Doe" {...register("fullName")} />
                      {errors.fullName && (
                        <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium mb-1 block">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <Input placeholder="123 Main Street, Apt 4B" {...register("address")} />
                      {errors.address && (
                        <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        City <span className="text-red-500">*</span>
                      </label>
                      <Input placeholder="Nashik" {...register("city")} />
                      {errors.city && (
                        <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <Input placeholder="422001" {...register("pincode")} />
                      {errors.pincode && (
                        <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        State <span className="text-red-500">*</span>
                      </label>
                      <Input placeholder="Maharashtra" {...register("state")} />
                      {errors.state && (
                        <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <Input placeholder="9876543210" {...register("phone")} />
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="font-bold">Payment Method</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You will be redirected to Razorpay to complete your payment securely.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="border-0 shadow-sm sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h2 className="font-bold text-lg">Order Summary</h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate mr-2">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      {delivery === 0 ? (
                        <span className="text-green-600 font-semibold">Free</span>
                      ) : (
                        <span>{formatPrice(delivery)}</span>
                      )}
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-lg text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-full"
                    disabled={placing}
                  >
                    {placing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {step || "Placing Order..."}
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
}
