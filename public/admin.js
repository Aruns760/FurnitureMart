function adminLogin(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Example of simple validation
    if (!email || !password) {
        document.getElementById('error-message').textContent = "Please fill in both fields.";
        return;
    }

    // Make API request to verify credentials
    fetch('/api/admin-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.token) {
            // Save token and redirect to Admin Dashboard
            localStorage.setItem('adminToken', data.token);
            window.location.href = '/admin.html';
        } else {
            document.getElementById('error-message').textContent = "Invalid email or password.";
        }
    })
    .catch(err => {
        document.getElementById('error-message').textContent = "An error occurred. Please try again later.";
    });
}

async function loadDashboard() {
    const loadingMessage = document.getElementById("loading-message");
    loadingMessage.classList.remove("hidden");

    const token = localStorage.getItem("adminToken");
    if (!token) {
        window.location.href = "admin-login.html";
        return;
    }

    try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
            fetch("http://localhost:5000/api/users", { 
                headers: { Authorization: `Bearer ${token}` } 
            }),
            fetch("http://localhost:5000/api/products", { 
                headers: { Authorization: `Bearer ${token}` } 
            }),
            fetch("http://localhost:5000/api/orders", { 
                headers: { Authorization: `Bearer ${token}` } 
            })
        ]);

        if (!usersRes.ok || !productsRes.ok || !ordersRes.ok) {
            throw new Error("Failed to fetch dashboard data.");
        }
z
        const users = await usersRes.json();
        const products = await productsRes.json();
        const orders = await ordersRes.json();

        document.getElementById("total-users").innerText = users.length;
        document.getElementById("total-products").innerText = products.length;
        document.getElementById("total-orders").innerText = orders.length;

        // Hide loading message once data is loaded
        loadingMessage.classList.add("hidden");
    } catch (error) {
        console.error("Error loading dashboard:", error);
        loadingMessage.classList.add("hidden");
    }
}

async function loadProducts() {
    const loadingMessage = document.getElementById("loading-message");
    loadingMessage.classList.remove("hidden");

    const token = localStorage.getItem("adminToken");
    if (!token) {
        window.location.href = "/FurnitureMart/public/admin-dashboard.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/products", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch products");

        const products = await response.json();

        const productTable = document.getElementById("product-list").querySelector("tbody");
        productTable.innerHTML = "";

        products.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.id}</td>
                <td><img src="${product.image_url}" width="50" height="50" alt="Product Image"></td>
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="edit-btn" onclick="editProduct(${product.id}, '${product.name}', '${product.description}', ${product.price}, ${product.stock}, '${product.image_url}')">✏️ Edit</button>
                    <button class="delete-btn" onclick="deleteProduct(${product.id})">🗑️ Delete</button>
                </td>
            `;
            productTable.appendChild(row);
        });

        // Hide loading message once products are loaded
        loadingMessage.classList.add("hidden");
    } catch (error) {
        console.error("Error loading products:", error);
        loadingMessage.classList.add("hidden");
    }
}
