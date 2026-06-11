import { describe, it, expect } from "vitest";
import { cn, formatPrice, slugify } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden")).toBe("base");
  });
});

describe("formatPrice", () => {
  it("formats price in INR", () => {
    const result = formatPrice(100);
    expect(result).toContain("₹");
    expect(result).toContain("100");
  });

  it("formats decimal price", () => {
    const result = formatPrice(99.99);
    expect(result).toContain("₹");
  });
});

describe("slugify", () => {
  it("converts string to slug", () => {
    expect(slugify("Fresh Tomatoes")).toBe("fresh-tomatoes");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! World@")).toBe("hello-world");
  });

  it("handles multiple spaces", () => {
    expect(slugify("a   b")).toBe("a-b");
  });
});
