// Function to get query parameters from the URL
function getQueryParam(param) {
    let params = new URLSearchParams(window.location.search);
    return params.get(param);
}

// Function to load product details
function loadProductDetails() {
    const productTitle = document.getElementById("product-title");
    const productPrice = document.getElementById("product-price");
    const productImage = document.getElementById("product-image");
    const productDescription = document.getElementById("product-description");

    // Set product details from query parameters
    productTitle.innerText = getQueryParam("name");
    productPrice.innerText = `$${getQueryParam("price")}`;
    productImage.src = getQueryParam("image");
    productDescription.innerText = getQueryParam("description");
}

// Function to add product to cart
function addToCartFromDetails() {
    const name = getQueryParam("name");
    const price = parseFloat(getQueryParam("price"));
    const image = getQueryParam("image");

    // Retrieve existing cart items or initialize an empty array
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.name === name);
    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity if product exists
    } else {
        cart.push({ name, price, image, quantity: 1 }); // Add new product to cart
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Notify the user
    alert(`${name} has been added to your cart!`);
}

// Load product details when the page loads
document.addEventListener("DOMContentLoaded", loadProductDetails);