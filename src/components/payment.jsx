// components/payment.js
export const startPayment = async (bookingData, token) => {
  try {
    const res = await fetch(
      "http://localhost:5000api/payment/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      }
    );

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // redirect to Stripe checkout
    } else {
      alert(" Payment session failed");
    }
  } catch (e) {
    console.error("Payment error:", e);
    alert(" Payment failed. Try again later.");
  }
};
