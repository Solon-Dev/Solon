// Payment processing utility
function processPayment(amount, userId) {
  // Calculate processing fee
  const fee = amount * 0.029 + 0.30;
  const total = amount + fee;
  
  // Process the payment
  const result = chargeCard(userId, total);
  
  return {
    success: true,
    amount: total,
    transactionId: result.id
  };
}

function refundPayment(transactionId) {
  const refund = processRefund(transactionId);
  return refund.success;
}

function calculateDiscount(price, code) {
  if (code === "SAVE10") {
    return price * 0.9;
  }
  if (code === "SAVE20") {
    return price * 0.8;
  }
  return price;
}

module.exports = { processPayment, refundPayment, calculateDiscount };
