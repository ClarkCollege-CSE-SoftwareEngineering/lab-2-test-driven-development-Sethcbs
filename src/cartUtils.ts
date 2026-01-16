export function applyDiscount(price: number, discountPercent: number): number {
  if(price < 0){
    throw new Error("Price cannot be negative");
  }
  if(discountPercent < 0){
    throw new Error("Discount cannot be negative");
  }
  if(discountPercent > 100){
    throw new Error("Discount cannot exceed 100%");
  }
  const discountMultiplier = 1 - discountPercent / 100;
  return price * discountMultiplier;
}

export function calculateTax(
  price: number,
  taxPercent: number,
  isTaxExempt: boolean = false
): number {

  if(price < 0){
    throw new Error("Price cannot be negative");
  }
  if(taxPercent < 0){
    throw new Error("Tax rate cannot be negative");
  }
  if(isTaxExempt){
    return 0;
  }
  const tax = price * (taxPercent / 100);
  return Math.round(tax * 100) / 100;
}

export function calculateTotal(
  items: CartItem[],
  discountPercent: number = 0,
  taxRate: number = 0
): CartTotals {

  const currentCart: CartTotals = {
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0
  };
//check if the cart contains any invalid items
  for (const item of items){
    if (item.quantity < 0 ){
      throw new Error("Cart item quantity cannot be negative");
    }
  }
//calculate the subtotal by adding the prices of each item in our cart to the CartTotals price
  for (const item of items){
    currentCart.subtotal += (item.price * item.quantity);
  }

//calculate the discount of the cart to store in the CartTotals discount
//  (will be subtracted from the subtotal later)
  currentCart.discount = currentCart.subtotal * (discountPercent/100);

//for each item in the cart add its tax to the CartTotals tax if it's not tax exempt
  for (const item of items){
      const itemTax = calculateTax(item.price, taxRate, item.isTaxExempt);
      currentCart.tax += (itemTax * item.quantity);
  } 
  currentCart.total = currentCart.subtotal - currentCart.discount + currentCart.tax;
  return currentCart;
}

export interface CartItem {
  price: number;
  quantity: number;
  isTaxExempt?: boolean;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}
