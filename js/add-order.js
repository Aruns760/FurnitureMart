const API_URL = 'http://localhost:5000/api';

// Fetch users and populate the dropdown
function loadUsers() {
    fetch(`${API_URL}/users/customers`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(users => {
            const userSelect = document.getElementById('user-id');
            userSelect.innerHTML = '<option value="">Select a customer</option>'; // Default option

            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.username || user.email; // Show username or fallback to email
                userSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading users:', error);
            alert('Failed to load users. Please try again.');
        });
}

// Handle form submission
document.getElementById('add-order-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    // Collect form data
    const orderData = {
        user_id: document.getElementById('user-id').value,
        product_id: document.getElementById('product-id').value,
        quantity: document.getElementById('quantity').value,
        status: document.getElementById('order-status').value,
    };

    // Validate form data
    if (!orderData.user_id || !orderData.product_id || !orderData.quantity || !orderData.status) {
        alert("All fields are required: user_id, product_id, quantity, status");
        return;
    }

    try {
        // Send POST request to your backend API
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Order added successfully!');
            document.getElementById('add-order-form').reset();
            window.location.href = 'manage-orders.html'; // Redirect after success
        } else {
            alert(`Failed to add order: ${result.message}`);
        }
    } catch (error) {
        console.error('Error adding order:', error);
        alert('An error occurred while adding the order.');
    }
});

// Load users on page load
window.onload = loadUsers;
