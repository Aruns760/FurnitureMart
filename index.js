let cartCount = 0;

function shopNow() {
    alert("Redirecting to the shop page...");
    window.location.href = "shop.html";
}

function filterCategory(category) {
    alert("Showing products in: " + category);
}

function addToCart(item) {
    cartCount++;
    document.getElementById("cart-count").innerText = cartCount;
    alert(item + " added to cart!");
}

function searchProducts() {
    let input = document.getElementById("search-bar").value.toLowerCase();
    let products = document.querySelectorAll(".product");

    products.forEach(product => {
        let productName = product.querySelector("h3").innerText.toLowerCase();
        if (productName.includes(input)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

// Search Functionality
function searchProducts() {
    let input = document.getElementById("search-bar").value.toLowerCase();
    let productCards = document.querySelectorAll(".product-card");

    productCards.forEach(card => {
        let productName = card.querySelector("h3").innerText.toLowerCase();
        if (productName.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
    document.getElementById("search-input").addEventListener("keyup", function() {
        let query = this.value.toLowerCase();
        let products = document.querySelectorAll(".product");
    
        products.forEach(product => {
            let name = product.querySelector("h3").innerText.toLowerCase();
            product.style.display = name.includes(query) ? "block" : "none";
        });
    });
}
document.addEventListener("DOMContentLoaded", function () {
    let userMenu = document.getElementById("user-menu");

    // Check if user is logged in
    let storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
        // Allow guest access
        userMenu.innerHTML = `
            Welcome, Guest | 
            <a href="login.html">Login</a>
        `;
    } else {
        // Show username and logout option
        userMenu.innerHTML = `
            Welcome, ${storedUser.name} | 
            <a href="#" onclick="logout()">Logout</a>
        `;
    }
});

// Logout function
function logout() {
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    window.location.href = "login.html";
}

// Add product to cart
function addToCart(productName, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if product already exists in the cart
    let existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name: productName, price: price, quantity: 1, image: image });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(productName + " added to cart!");
}

// Update cart count in the navbar
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.getElementById("cart-count").innerText = cart.length;
}

// Ensure cart count updates on page load
document.addEventListener("DOMContentLoaded", updateCartCount);

// scroll page
document.addEventListener("DOMContentLoaded", function () {
    let products = {
        sofas: [
            { 
                name: "Luxury Leather Sofa", 
                price: 7599.99, 
                image: "Sofa img/6f1c118b-473c-459e-8029-453fbea3a208.jpg",
                description: "Premium Italian leather"
            },
            { 
                name: "Modern Recliner Sofa", 
                price: 4299.99, 
                image: "Sofa img/f3117229-77f2-44ca-9c5c-9fd469df03b3.jpg",
                description: "Cup holders and USB ports"
            },
            { 
                name: "Classic Wooden Sofa", 
                price: 5499.99, 
                image: "Sofa img/8203772b-94b6-4c0f-b525-115f9ee8cb22.jpg",
                description: "Handcrafted teak wood sofa"
            },
            { 
                name: "Convertible Sofa Bed", 
                price: 2899.99, 
                image: "Sofa img/1e26aee3-7b4e-466a-b594-f7585d7918d4.jpg",
                description: "Converts into a double bed"
            },
            { 
                name: "Outdoor Rattan Sofa", 
                price: 3899.99, 
                image: "Sofa img/1774c8b4-b4c9-4fb2-9445-bda213b23c94.jpg",
                description: "Weather-resistant"
            },
            { 
                name: "Kids Sofa with Storage", 
                price: 1499.99, 
                image: "Sofa img/ab743a5e-8802-45ad-ac8b-276ba80371d6.jpg",
                description: "Built-in toy storage"
            },
            { 
                name: "Scandinavian Sofa", 
                price: 3499.99, 
                image: "Sofa img/de8d732e-f771-4f03-a72c-07fa4742cd78.jpg",
                description: "Sleek and modern sofa"
            },
            { 
                name: "Royal Velvet Sofa", 
                price: 8999.99, 
                image: "Sofa img/4ec9c5cf-e944-4882-b090-2aa0e6ccb120.jpg",
                description: "Elegant velvet with gold-tone legs"
            },
            { 
                name: "Sectional Sofa Set", 
                price: 6599.99, 
                image: "Sofa img/72a94c23-4cad-4d16-92b1-b463caf7d159.jpg",
                description: "Modular L-shaped sofa"
            },
            { 
                name: "Massage Recliner", 
                price: 9999.99, 
                image: "Sofa img/fd211efe-dceb-4666-a47a-37f75c6eacb6.jpg",
                description: "Built-in massage and heating"
            }
        ],
        tables: [
            { 
                name: "Wood Dining Table", 
                price: 2499.99, 
                image: "Tables img/413072fb-a06c-4c5f-a5c8-0763c9a86860.jpg",
                description: "Handcrafted dining table"
            },
            { 
                name: "Tempered Glass Table", 
                price: 8999.99, 
                image: "Tables img/e220a5aa-bd8c-4c13-9f7a-54a698877de5.jpg",
                description: "Modern table with metal frame"
            },
            { 
                name: "Ergonomic Desk", 
                price: 1499.99, 
                image: "Tables img/449953d2-8e75-4fb0-a8d2-48e8f7d1f239.jpg",
                description: "Adjustable height desk"
            },
            { 
                name: "Foldable Table", 
                price: 4999.99, 
                image: "Tables img/32f6e922-e7b5-42e9-9511-948881108bc6.jpg",
                description: "Space-saving foldable"
            },
            { 
                name: "Outdoor Patio Table", 
                price: 7999.99, 
                image: "Tables img/32f6e922-e7b5-42e9-9511-948881108bc6.jpg",
                description: "Weather-resistant table"
            },
            { 
                name: "Marble Top Center Table", 
                price: 2999.99, 
                image: "Tables img/14eca508-c01e-4492-912e-e9046b78fd5a.jpg",
                description: "Elegant marble top table"
            },
            { 
                name: "Kids Study Table & Chair", 
                price: 999.99, 
                image: "Tables img/6bc4c032-750e-4890-b7e0-600932ccc254.jpg",
                description: "Colorful table set"
            },
            { 
                name: "Industrial Workbench", 
                price: 1999.99, 
                image: "Tables img/6c0a03a2-1a99-4b89-964a-c97e2738140b.jpg",
                description: "Duty metal and wood workbench"
            },
            { 
                name: "Glass Dining Table", 
                price: 1899.99, 
                image: "Tables img/c2aa6347-3374-4eee-900f-6a73d5a039cb.jpg",
                description: "4-seater round dining"
            },
            { 
                name: "Laptop Bed Table", 
                price: 1999.99, 
                image: "Tables img/34314b25-c6f0-448b-96a2-d1e827d419b1.jpg",
                description: "Portable table for use on beds"
            }
        ],
        beds: [
            { 
                name: "Advance Storage Bed", 
                price: 11199.99, 
                image: "bed img/1e0e0029-2f6e-4722-b89f-51c84ccdce4e.jpg",
                description: "Spacious likes bed with hydraulic"
            },
            { 
                name: "Single Wooden Bed", 
                price: 4999.99, 
                image: "bed img/e2da94aa-4546-4faf-ad03-550cfda02b92.jpg",
                description: "Solid sheesham wood bed"
            },
            { 
                name: "LARGE Upholstered Bed", 
                price: 7999.99, 
                image: "bed img/29bf7f52-aeca-4936-b3f0-99cb0da452e1.jpg",
                description: "Luxury fabric bed"
            },
            { 
                name: "Bunk Bed , Study Table", 
                price: 2999.99, 
                image: "bed img/e2da94aa-4546-4faf-ad03-550cfda02b92.jpg",
                description: "Space-saving bunk bed"
            },
            { 
                name: "Folding Wall Bed", 
                price: 2999.99, 
                image: "bed img/c0ee489c-d20a-4e22-81e8-5f94e9e4117b.jpg",
                description: "Foldable bed that mounts"
            },
            { 
                name: "Canopy Bed , Curtains", 
                price: 5999.99, 
                image: "bed img/5ee67270-ec6e-46e6-82b4-2f07add91319.jpg",
                description: "Elegant bed with sheer curtains"
            },
            { 
                name: "Low Platform Bed", 
                price: 1999.99, 
                image: "bed img/5ee67270-ec6e-46e6-82b4-2f07add91319.jpg",
                description: "Minimalist low-height"
            },
            { 
                name: "Kids Themed Bed", 
                price: 2799.99, 
                image: "bed img/7cd8af7d-e9a4-413a-b4a2-6dae8a501750.jpg",
                description: "Fun-themed bed, safety rails"
            },
            { 
                name: "Adjustable Electric Bed", 
                price: 8999.99, 
                image: "bed img/d0442093-113c-4125-8e39-21cf8637b656.jpg",
                description: "Motorized bed with adjustable"
            },
            { 
                name: "Metal Frame Bed", 
                price: 1499.99, 
                image: "bed img/3f757fd7-7332-432b-a202-a203b9b91014.jpg",
                description: "Arame with anti-rust coating"
            }
        ],
        chairs: [
            { 
                name: "Ergonomic Office Chair", 
                price: 999.99, 
                image: "chair img/eb2e1f2c-cfc8-4373-9659-6e5e64988a3a.jpg",
                description: "Adjustable lumbar support"
            },
            { 
                name: "Gaming Chair ,Footrest", 
                price: 4999.99, 
                image: "chair img/81117ba1-9ec8-4a09-9e89-d4e620b545d7.jpg",
                description: "High-back gaming chair"
            },
            { 
                name: "Classic Leather Armchair", 
                price: 2999.99, 
                image: "chair img/cff0071f-b286-4b8d-8506-c58a0131a120.jpg",
                description: "Premium leather armchair"
            },
            { 
                name: "Foldable Plastic Chair", 
                price: 999.99, 
                image: "chair img/dd8e8fa9-bdcd-497e-a8d1-ac77569673dd.jpg",
                description: "Chair for indoor/outdoor use"
            },
            { 
                name: "Rocking Chair", 
                price: 899.99, 
                image: "chair img/f4488f39-7bf1-4e76-b559-876cd588dafa.jpg",
                description: "Traditional wooden rocking"
            },
            { 
                name: "Bean Bag Chair", 
                price: 3999.99, 
                image: "chair img/5e8338bc-3a73-43cf-9c7f-cf815936dae6.jpg",
                description: "Comfortable bean bag chair"
            },
            { 
                name: "Bar Stool (Set of 2)", 
                price: 4999.99, 
                image: "chair img/45cd80bf-a8f8-466d-aef3-186d5284f81f.jpg",
                description: "Adjustable stools for counters"
            },
            { 
                name: "Kids Study Chair", 
                price: 2999.99, 
                image: "chair img/7c7dd51c-99e3-48c2-8db2-9e5dc9d52460.jpg",
                description: "Ergonomic chair with back"
            },
            { 
                name: "Outdoor Patio Chair", 
                price: 5999.99, 
                image: "chair img/30dc6c92-9d35-4225-8db7-d2582b9fa702.jpg",
                description: "Weather-resistant chair"
            },
            { 
                name: "Recliner Chair, Massage", 
                price: 4999.99, 
                image: "chair img/88fde894-d8e1-4caa-97eb-e03a048892bf.jpg",
                description: "built-in massage and heating"
            }
        ],
        wardrobes: [
            { 
                name: "Sliding Door Wardrobe", 
                price: 4999.99, 
                image: "wardrobs img/e5c84d4c-4bcf-400d-96a5-8e510cf3e9a0.jpg",
                description: "Sliding door wardrobe"
            },
            { 
                name: "Walk-In Wardrobe", 
                price: 9999.99, 
                image: "wardrobs img/5072435d-4100-494c-bd6f-78561d982dc6.jpg",
                description: "Luxury walk-in wardrobe"
            },
            { 
                name: "Folding Wardrobe", 
                price: 2999.99, 
                image: "wardrobs img/dc2e5374-06a2-4f50-9367-51c08a03621a.jpg",
                description: "Space-saving folding wardrobe"
            },
            { 
                name: "Kids Wardrobe", 
                price: 7999.99, 
                image: "wardrobs img/55224897-c65c-4877-a4ed-d887a995e94a.jpg",
                description: "Colorful wardrobe with cartoon"
            },
            { 
                name: "Solid Wood Wardrobe", 
                price: 4999.99, 
                image: "wardrobs img/82e73142-4b09-4416-8337-c56797f53d3a.jpg",
                description: "Handcrafted teak wood wardrobe"
            },
            { 
                name: "Metal Wardrobe", 
                price: 1999.99, 
                image: "wardrobs img/f1c7016f-cd51-46f9-8364-ddf3916a1808.jpg",
                description: "Wardrobe with anti-rust coating"
            },
            { 
                name: "Mirror Finish Wardrobe", 
                price: 2999.99, 
                image: "wardrobs img/39d00e59-4bed-4fc6-8d9d-2ea0bc8a9ae2.jpg",
                description: "Full-length mirror doors"
            },
            { 
                name: "Modular Wardrobe", 
                price: 4599.99, 
                image: "wardrobs img/416862ef-b727-4356-91a9-f5e76f470b52.jpg",
                description: "Customizable modular wardrobe"
            },
            { 
                name: "Vintage Wardrobe", 
                price: 5499.99, 
                image: "wardrobs img/acff9513-7379-470b-8fe2-49bbb3e33e33.jpg",
                description: "Antique-style wardrobe"
            },
            { 
                name: "Corner Wardrobe", 
                price: 1999.99, 
                image: "wardrobs img/8061d175-ef7f-4941-b66e-55d5343847e0.jpg",
                description: "Space-efficient corner"
            }
        ]
    };

    // Function to add to cart
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
    // Function to add to wishlist
    window.addToWishlist = function(name, image) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (!wishlist.some(item => item.name === name)) {
            wishlist.push({
                name: name,
                image: image
            });
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            showNotification(`${name} added to wishlist!`);
        } else {
            showNotification(`${name} is already in your wishlist!`);
        }
    };

    // Function to show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    // Function to update cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cart.length;
        }
    }

    // Function to load products
    function loadProducts(category, containerId) {
        let container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = ''; // Clear container
        
        products[category].forEach(product => {
            let productElement = document.createElement("div");
            productElement.classList.add("product");
            
            productElement.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">₹ ${product.price.toFixed(2)}</p>
                    <p class="description">${product.description}</p>
                    <div class="rating">⭐⭐⭐⭐</div>
                    <div class="product-actions">
                        <button class="add-to-cart" onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">
                            <span class="btn-text">Add to Cart</span>
                            <span class="btn-icon">🛒</span>
                        </button>
                        <button class="wishlist" onclick="addToWishlist('${product.name}', '${product.image}')">
                            <span>❤️</span>
                        </button>
                    </div>
                    <a href="product.html?name=${encodeURIComponent(product.name)}&price=${product.price}&image=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.description)}" class="view-details">View Details</a>
                </div>
            `;
            
            container.appendChild(productElement);
        });
    }

    // Load products for each category
    loadProducts("sofas", "sofa-list");
    loadProducts("tables", "table-list");
    loadProducts("beds", "bed-list");
    loadProducts("chairs", "chair-list");
    loadProducts("wardrobes", "wardrobe-list");

    // Initialize cart count
    updateCartCount();
});
function viewCategory(categoryName) {
    window.location.href = `category.html?category=${encodeURIComponent(categoryName)}`;
}
// Open Quick View Modal
function openModal(name, price, image, description) {
    document.getElementById("modal-title").innerText = name;
    document.getElementById("modal-price").innerText = "₹" + price.toFixed(2);
    document.getElementById("modal-image").src = image;
    document.getElementById("modal-description").innerText = description;

    document.getElementById("product-modal").style.display = "flex";
}

// Close Modal
function closeModal() {
    document.getElementById("product-modal").style.display = "none";
}

// Add to Cart from Modal
function addToCartFromModal() {
    let name = document.getElementById("modal-title").innerText;
    let price = parseFloat(document.getElementById("modal-price").innerText.replace("₹", ""));
    let image = document.getElementById("modal-image").src;

    addToCart(name, price, image);
    closeModal();
}


// Function to navigate to different pages
function navigateTo(page) {
    window.location.href = page;
}
// Add Item to Cart
function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if item already exists in cart
    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price: parseFloat(price), image, quantity: 1 }); // Ensure price is a number
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " added to cart!");
    updateCartCount();
}

// Add to Wishlist
function addToWishlist(name, image) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist.push({ name, image });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert(name + " added to wishlist!");
}

// Load Product Details from URL
function loadProductDetails() {
    let params = new URLSearchParams(window.location.search);
    document.getElementById("product-name").innerText = params.get("name");
    document.getElementById("product-price").innerText = "₹" + params.get("price");
    document.getElementById("product-image").src = params.get("image");
}
//Hero
let slideIndex = 0;
showSlides();

function showSlides() {
    let slides = document.querySelectorAll(".slide");
    let dots = document.querySelectorAll(".dot");

    slides.forEach(slide => slide.style.display = "none");
    dots.forEach(dot => dot.classList.remove("active"));

    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].classList.add("active");

    setTimeout(showSlides, 4000); // Change slide every 3s
}

function changeSlide(n) {
    slideIndex += n - 1;
    showSlides();
}

function currentSlide(n) {
    slideIndex = n - 1;
    showSlides();
}
