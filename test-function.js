// Test function for Solon AI review
function calculateDiscount(price, discountPercent) {
  const discount = price * (discountPercent / 100);
  return price - discount;
}

function processOrder(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

module.exports = { calculateDiscount, processOrder };
