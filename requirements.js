document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('requirement-form');
    const requirementList = document.getElementById('requirement-list');
    const searchBar = document.getElementById('search-bar');
    const sortOptions = document.getElementById('sort-options');
    const modal = document.getElementById('requirement-modal');
    const modalContent = document.getElementById('requirement-details-content');
    const closeButton = document.querySelector('.close-button');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const requirementName = document.getElementById('requirement-name').value;
        const requirementDetails = document.getElementById('requirement-details').value;
        const quantity = document.getElementById('quantity').value;
        const deliveryDate = document.getElementById('delivery-date').value;
        const requirementImage = document.getElementById('requirement-image').files[0];
        const isUrgent = document.getElementById('urgent').checked;

        const requirementItem = document.createElement('div');
        requirementItem.className = 'requirement-item';
        requirementItem.innerHTML = `
            <h3>${requirementName}</h3>
            <p>${requirementDetails}</p>
            <p>Quantity: ${quantity}</p>
            <p>Preferred Delivery Date: ${deliveryDate}</p>
            <p>Contact: ${name}, ${phone}</p>
            <span>${isUrgent ? '🔥 Urgent' : ''}</span>
            <button class="delete-button">Delete</button>
        `;

        if (requirementImage) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                requirementItem.appendChild(img);
            }
            reader.readAsDataURL(requirementImage);
        }

        requirementItem.addEventListener('click', () => {
            showRequirementDetails({
                name,
                phone,
                requirementName,
                requirementDetails,
                quantity,
                deliveryDate,
                isUrgent,
                requirementImage: requirementImage ? requirementImage.name : null,
            });
        });

        requirementList.prepend(requirementItem);

        // Add delete functionality
        requirementItem.querySelector('.delete-button').addEventListener('click', (e) => {
            e.stopPropagation();
            requirementItem.remove();
        });

        form.reset();
    });

    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        const items = requirementList.getElementsByClassName('requirement-item');

        Array.from(items).forEach(item => {
            const name = item.querySelector('h3').textContent.toLowerCase();
            const details = item.querySelector('p').textContent.toLowerCase();
            item.style.display = name.includes(query) || details.includes(query) ? '' : 'none';
        });
    });

    sortOptions.addEventListener('change', () => {
        const items = Array.from(requirementList.getElementsByClassName('requirement-item'));
        const sortedItems = items.sort((a, b) => {
            if (sortOptions.value === 'latest') {
                return b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING;
            } else if (sortOptions.value === 'oldest') {
                return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING;
            } else if (sortOptions.value === 'quantity') {
                const quantityA = parseInt(a.querySelectorAll('p')[2].textContent.split(': ')[1]);
                const quantityB = parseInt(b.querySelectorAll('p')[2].textContent.split(': ')[1]);
                return quantityB - quantityA;
            }
        });

        requirementList.innerHTML = '';
        sortedItems.forEach(item => requirementList.appendChild(item));
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = "none";
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    function showRequirementDetails(details) {
        modalContent.innerHTML = `
            <h2>${details.requirementName}</h2>
            <p><strong>Description:</strong> ${details.requirementDetails}</p>
            <p><strong>Quantity:</strong> ${details.quantity}</p>
            <p><strong>Preferred Delivery Date:</strong> ${details.deliveryDate}</p>
            <p><strong>Contact:</strong> ${details.name}, ${details.phone}</p>
            <p><strong>Urgent:</strong> ${details.isUrgent ? 'Yes' : 'No'}</p>
            ${details.requirementImage ? `<img src="images/${details.requirementImage}" alt="${details.requirementName}">` : ''}
        `;
        modal.style.display = "block";
    }
});
