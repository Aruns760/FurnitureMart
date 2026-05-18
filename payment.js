function loadPaymentDetails() {
    let orderDetails = JSON.parse(localStorage.getItem("orderDetails"));

    if (!orderDetails) {
        alert("No order details found. Redirecting to checkout...");
        window.location.href = "checkout.html";
        return;
    }

    document.getElementById("order-total").innerText = "Total: $" + orderDetails.total;
    document.getElementById("payment-method").innerText = "Payment Method: " + orderDetails.paymentMethod;
}

function completeOrder() {
    alert("Payment Successful! 🎉 Your order has been placed.");
    localStorage.removeItem("cart");
    localStorage.removeItem("orderDetails");
    window.location.href = "index.html"; // Redirect to Home Page
}
