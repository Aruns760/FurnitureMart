// Load Product Details from URL
document.addEventListener("DOMContentLoaded", function () {
    loadProductDetails();

    // Handle Purchase Form Submission
    const buyForm = document.getElementById("buy-form");
    if (buyForm) {
        buyForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let name = document.getElementById("name").value;
            let address = document.getElementById("address").value;
            let phone = document.getElementById("phone").value;

            if (!name || !address || !phone) {
                alert("Please fill in all details!");
                return;
            }

            alert(`Thank you ${name}! Your order has been placed successfully.`);
            window.location.href = "index.html"; // Redirect to home after purchase
        });
    }
});

function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get("name");
    const price = urlParams.get("price");
    const image = urlParams.get("image");

    if (name && price && image) {
        document.getElementById("product-name").innerText = name;
        document.getElementById("product-price").innerText = `₹${price}`;
        document.getElementById("product-image").src = image;
    } else {
        alert("Invalid product details. Redirecting to home page.");
        window.location.href = "index.html";
    }
}
