// Load Cart Items
function loadCartItems() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartContainer = document.getElementById("cart-items");
    let total = 0;

    cartContainer.innerHTML = "";
    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        let cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>₹<span id="price-${index}">${(item.price * item.quantity).toFixed(2)}</span></p>
            </div>
            <div class="cart-quantity">
                <button onclick="changeQuantity(${index}, -1)">-</button>
                <span id="quantity-${index}">${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        `;

        cartContainer.appendChild(cartItem);
    });

    document.getElementById("cart-total").innerText = total.toFixed(2);
}

// Proceed to Checkout Button (optional JS redirect)
function proceedToCheckout() {
    window.location.href = "checkout.html";
}


// Change Quantity of an Item
function changeQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart[index].quantity + change > 0) {
        cart[index].quantity += change;
    } else {
        cart.splice(index, 1); // Remove item if quantity is 0
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems(); // Reload cart to reflect changes
}

// Remove Item from Cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems();
}

// Checkout Function
function checkout() {
    if (confirm("Proceed to Checkout?")) {
        localStorage.removeItem("cart");
        loadCartItems();
        alert("Order placed successfully! 🎉");
    }
}

// Update Cart Count in Header
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").innerText = count;
}
