export function calculateDiscount(price, discountPercent) {
  return price - (price * discountPercent / 100);
}
