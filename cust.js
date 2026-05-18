document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('customization-form');
    
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const furnitureType = document.getElementById('furniture-type').value;
        const dimensions = document.getElementById('dimensions').value;
        const material = document.getElementById('material').value;
        const finish = document.getElementById('finish').value;
        const pattern = document.getElementById('pattern').value;
        const color = document.getElementById('color').value;
        const additionalDetails = document.getElementById('additional-details').value;

        const customOrder = {
            furnitureType,
            dimensions,
            material,
            finish,
            pattern,
            color,
            additionalDetails,
        };

        let customOrders = JSON.parse(localStorage.getItem('customOrders')) || [];
        customOrders.push(customOrder);
        localStorage.setItem('customOrders', JSON.stringify(customOrders));

        alert('Customization submitted successfully!');
        form.reset();
    });
});
