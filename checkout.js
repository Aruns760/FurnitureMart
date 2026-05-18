// Load Checkout Items from Cart
function loadCheckout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let checkoutContainer = document.getElementById("checkout-items");
    let total = 0;

    checkoutContainer.innerHTML = "";
    cart.forEach(item => {
        total += item.price * item.quantity;

        let checkoutItem = document.createElement("div");
        checkoutItem.classList.add("checkout-item");

        checkoutItem.innerHTML = `
            <p>${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}</p>
        `;

        checkoutContainer.appendChild(checkoutItem);
    });

    document.getElementById("checkout-total").innerText = total.toFixed(2);
}

// Handle Order Placement
document.getElementById("checkout-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let phone = document.getElementById("phone").value;
    let paymentMethod = document.getElementById("payment-method").value;

    if (!name || !address || !phone) {
        alert("Please fill in all details!");
        return;
    }

    alert(`Thank you ${name}! Your order has been placed successfully.`);
    
    // Clear Cart
    localStorage.removeItem("cart");
    window.location.href = "index.html"; // Redirect to home after order
});
function proceedToPayment(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let phone = document.getElementById("phone").value;
    let paymentMethod = document.getElementById("payment-method").value;

    if (!name || !address || !phone) {
        alert("Please fill in all details!");
        return;
    }

    // Store order details in localStorage for payment page
    let orderDetails = {
        name,
        address,
        phone,
        paymentMethod,
        total: document.getElementById("checkout-total").innerText
    };

    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));

    window.location.href = "payment.html"; // Redirect to Payment Page
}

document.addEventListener("DOMContentLoaded", function () {
    let checkoutContainer = document.getElementById("checkout-container");
    let selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));

    if (selectedProduct) {
        checkoutContainer.innerHTML = `
            <p>Product: ${selectedProduct.name}</p>
            <p>Price: ₹${selectedProduct.price}</p>
        `;
    } else {
        checkoutContainer.innerHTML = "<p>No items selected.</p>";
    }
});

function placeOrder() {
    alert("Your order has been placed successfully!");
    localStorage.removeItem("selectedProduct");
    window.location.href = "index.html";
}
