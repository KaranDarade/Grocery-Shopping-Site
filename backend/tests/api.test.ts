import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("API Health", () => {
  it("GET /api/health returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("Products API", () => {
  it("GET /api/products returns paginated products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("products");
    expect(res.body).toHaveProperty("pagination");
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  it("GET /api/products?search filters results", async () => {
    const res = await request(app).get("/api/products?search=tomato");
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it("GET /api/products?category filters by category", async () => {
    const res = await request(app).get("/api/products?category=fruits");
    expect(res.status).toBe(200);
    if (res.body.products.length > 0) {
      expect(res.body.products[0].category.slug).toBe("fruits");
    }
  });

  it("GET /api/products?page=1&limit=5 returns limited results", async () => {
    const res = await request(app).get("/api/products?page=1&limit=5");
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeLessThanOrEqual(5);
  });
});

describe("Categories API", () => {
  it("GET /api/categories returns categories with counts", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("categories");
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.length).toBeGreaterThan(0);
    if (res.body.categories.length > 0) {
      expect(res.body.categories[0]).toHaveProperty("_count");
    }
  });
});

describe("Auth API", () => {
  it("POST /api/auth/register creates a new user", async () => {
    const email = `test-${Date.now()}@test.com`;
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test User", email, password: "test123" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body.user.email).toBe(email);
  });

  it("POST /api/auth/login with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@demo.com", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("POST /api/auth/login with invalid credentials returns 401", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@demo.com", password: "wrongpassword" });
    expect(res.status).toBe(401);
  });
});

describe("Cart API", () => {
  let token: string;
  let productId: string;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@demo.com", password: "password123" });
    token = loginRes.body.accessToken;

    const prodRes = await request(app).get("/api/products?limit=1");
    productId = prodRes.body.products[0].id;
  });

  it("GET /api/cart returns cart items", async () => {
    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
  });

  it("POST /api/cart adds item to cart", async () => {
    const res = await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId, quantity: 2 });
    expect(res.status).toBe(201);
    expect(res.body.item.quantity).toBe(2);
  });
});

describe("Orders API", () => {
  let token: string;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "user@demo.com", password: "password123" });
    token = loginRes.body.accessToken;
  });

  it("GET /api/orders returns orders", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("orders");
    expect(res.body).toHaveProperty("pagination");
  });
});
