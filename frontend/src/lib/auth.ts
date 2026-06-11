import api from "./api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt?: string;
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

interface MeResponse {
  user: AuthUser;
}

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function registerApi(data: { name: string; email: string; password: string; phone?: string }): Promise<AuthResponse> {
  const { data: res } = await api.post("/auth/register", data);
  return res;
}

export async function logoutApi(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getMeApi(): Promise<MeResponse> {
  const { data } = await api.get("/auth/me");
  return data;
}

