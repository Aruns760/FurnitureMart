document.getElementById('addUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    const responseMessage = document.getElementById('responseMessage');
    
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, phone, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            responseMessage.style.color = '#28a745';
            responseMessage.textContent = 'Admin user added successfully!';
            document.getElementById('addUserForm').reset();
        } else {
            responseMessage.style.color = '#dc3545';
            responseMessage.textContent = data.message || 'Failed to add user';
        }
    } catch (error) {
        responseMessage.style.color = '#dc3545';
        responseMessage.textContent = 'Error connecting to server';
    }
});