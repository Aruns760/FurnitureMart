// Function to load saved customizations from localStorage
function loadCustomizations() {
    const container = document.getElementById('customizations-container');
    const savedCustomizations = JSON.parse(localStorage.getItem('customizations')) || [];

    if (!localStorage.getItem('customizations')) {
        const customizations = [
            {
                furnitureType: 'Chair',
                material: 'Wood',
                color: 'Brown',
                dimensions: '20x20x30'
            },
            {
                furnitureType: 'Table',
                material: 'Glass',
                color: 'Transparent',
                dimensions: '100x60x75'
            }
        ];
        localStorage.setItem('customizations', JSON.stringify(customizations));
    }

    container.innerHTML = ''; // Clear the container before loading

    savedCustomizations.forEach((customization, index) => {
        const card = document.createElement('div');
        card.className = 'customization-card';

        card.innerHTML = `
            <h2>Design ${index + 1}</h2>
            <p><strong>Furniture Type:</strong> ${customization.furnitureType}</p>
            <p><strong>Material:</strong> ${customization.material}</p>
            <p><strong>Color:</strong> ${customization.color}</p>
            <p><strong>Dimensions:</strong> ${customization.dimensions}</p>
            <button onclick="deleteCustomization(${index})">Delete</button>
        `;

        container.appendChild(card);
    });
}

// Function to delete a customization
function deleteCustomization(index) {
    const savedCustomizations = JSON.parse(localStorage.getItem('customizations')) || [];
    savedCustomizations.splice(index, 1); // Remove the customization at the specified index
    localStorage.setItem('customizations', JSON.stringify(savedCustomizations)); // Update localStorage
    loadCustomizations(); // Reload the customizations
}