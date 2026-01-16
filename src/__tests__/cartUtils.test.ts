import { describe, it, expect } from "vitest";
import { applyDiscount,
         calculateTax,
         calculateTotal,
         CartItem,
} from "../cartUtils";

describe("applyDiscount", () => {
  it("applies a percentage discount to a price", () => {
    expect(applyDiscount(100, 10)).toBe(90);
  });
  it("returns the original price when discount is 0%", () => {
    expect(applyDiscount(50, 0)).toBe(50);
  });
  it("returns 0 when the discount is %100", () => {
    expect(applyDiscount(75, 100)).toBe(0);
  });
  it("handles decimal prices correctly", () => {
    expect(applyDiscount(19.99, 10)).toBeCloseTo(17.99, 2);
  });
  it ("throws an error for negative prices", () => {
    expect(() => applyDiscount(-10, 10)).toThrow("Price cannot be negative");
  });
  it ("throws an error for negative discount percentages", () => {
    expect(() => applyDiscount(100, -5)).toThrow("Discount cannot be negative");
  });
  it ("throws an error for discount greater than 100%", () => {
    expect(() => applyDiscount(100, 150)).toThrow("Discount cannot exceed 100%");
  });
});

describe("calculateTax", () => {
  it("calculates tax on a price", () => {
    expect(calculateTax(100, 8.5)).toBeCloseTo(8.5, 2);
  });

  it("returns 0 tax when rate is 0%", () => {
    expect(calculateTax(50, 0)).toBe(0);
  });

  it("handles decimal prices correctly", () => {
    expect(calculateTax(19.99, 10)).toBeCloseTo(2.0, 2);
  });

  it("returns 0 tax when item is tax-exempt", () => {
    expect(calculateTax(100, 8.5, true)).toBe(0);
  });

  it("throws an error for negative prices", () => {
    expect(() => calculateTax(-10, 8.5)).toThrow("Price cannot be negative");
  });

  it("throws an error for negative tax rates", () => {
    expect(() => calculateTax(100, -5)).toThrow("Tax rate cannot be negative");
  });
});

describe("calculateTotal", () => {

  const eggs: CartItem = { price: 4, quantity: 1, isTaxExempt: false };
  const milk: CartItem = { price: 3, quantity: 2, isTaxExempt: false };
  const steak: CartItem = { price: 28, quantity: 2, isTaxExempt: true};
  const rotten_meat: CartItem = { price: -1000, quantity: 2, isTaxExempt: true};
  const dark_matter: CartItem = { price: 1, quantity: -2, isTaxExempt: false};

  it("calculates totals for a single item", () => {
    const testCart = [eggs];
    const result = calculateTotal(testCart, 5, 10);
    expect(result.total).toBeCloseTo(4.2);
  });

  it("calculates totals for multiple items", () => {
    const testCart = [milk, eggs];
    const result = calculateTotal(testCart, 10, 10);
    expect(result.total).toBe(10);
  });

  it("applies discount before calculating tax", () => {
    //Not super confident about this test, but I figure that if we applied the 
    //discount after tax deduction, then the resulting discount would actually
    //be 1.8.
    const testCart = [eggs];
    const result = calculateTotal(testCart, 5, 10);
    expect(result.discount).toBeCloseTo(0.2);
  });

  it("excludes tax-exempt items from tax calculation", () => {
    const testCart = [steak];
    const result = calculateTotal(testCart, 0, 50);
    expect(result.total).toBe(56);
  });

  it("throws an error is the cart has negatively valued items", () => {
    const testCart = [rotten_meat, eggs];
    expect(() => calculateTotal(testCart, 10, 0)).toThrow("Price cannot be negative");
  });

  it("throws an error is the cart has negative quantity of items", () => {
    const testCart = [dark_matter, steak];
    expect(() => calculateTotal(testCart, 10, 0)).toThrow("Cart item quantity cannot be negative");
  });

  it("calculates totals for a cart with tax exempt and non tax exempt items", () => {
    const testCart = [eggs, steak, milk];
    const result = calculateTotal(testCart, 0, 10);
    expect(result.total).toBe(67);
  });
});
