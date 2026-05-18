// public/js/delete-order.js
async function deleteOrder(orderId) {
    if (confirm("Are you sure you want to delete this order?")) {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            alert(data.message);

            // Reload the page or update UI
            if (response.ok) {
                location.reload();
            }
        } catch (error) {
            console.error("Error deleting order:", error);
            alert("Failed to delete order");
        }
    }
}
