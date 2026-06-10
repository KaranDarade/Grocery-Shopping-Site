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
