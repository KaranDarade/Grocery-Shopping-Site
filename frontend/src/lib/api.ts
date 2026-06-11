import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await api.post("/auth/refresh");
        return axios.request(error.config);
      } catch {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAt: number | null;
  images: string[];
  stock: number;
  unit: string;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count: { products: number };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationInfo;
}

export async function getProducts(params?: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<ProductsResponse> {
  const { data } = await api.get("/products", { params });
  return data;
}

export async function getProductBySlug(
  slug: string
): Promise<{ product: Product }> {
  const { data } = await api.get(`/products/${slug}`);
  return data;
}

export async function getFeaturedProducts(): Promise<{
  products: Product[];
}> {
  const { data } = await api.get("/products/featured");
  return data;
}

export async function getCategories(): Promise<{
  categories: Category[];
}> {
  const { data } = await api.get("/categories");
  return data;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export async function getCart(): Promise<{ items: CartItem[] }> {
  const { data } = await api.get("/cart");
  return data;
}

export async function addToCart(productId: string, quantity?: number): Promise<{ item: CartItem }> {
  const { data } = await api.post("/cart", { productId, quantity });
  return data;
}

export async function updateCartItem(id: string, quantity: number): Promise<{ item: CartItem }> {
  const { data } = await api.patch(`/cart/${id}`, { quantity });
  return data;
}

export async function removeCartItem(id: string): Promise<void> {
  await api.delete(`/cart/${id}`);
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: { id: string; name: string; slug: string; images: string[]; unit: string };
}

export interface Payment {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  status: string;
  amount: number;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  paymentStatus: string;
  shippingAddress: any;
  razorpayOrderId: string | null;
  items: OrderItem[];
  payment: Payment | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: PaginationInfo;
}

export async function getOrders(params?: {
  page?: number;
  limit?: number;
}): Promise<OrdersResponse> {
  const { data } = await api.get("/orders", { params });
  return data;
}

export async function getOrderById(
  id: string
): Promise<{ order: Order }> {
  const { data } = await api.get(`/orders/${id}`);
  return data;
}

export async function createOrder(): Promise<{ order: Order }> {
  const { data } = await api.post("/orders");
  return data;
}

export async function createRazorpayOrder(orderId: string): Promise<{ razorpayOrderId: string; amount: number; currency: string; keyId: string }> {
  const { data } = await api.post("/payments/create-order", { orderId });
  return data;
}

export async function verifyPayment(payload: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }): Promise<{ message: string; order: Order }> {
  const { data } = await api.post("/payments/verify", payload);
  return data;
}
