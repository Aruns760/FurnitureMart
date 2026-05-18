document.addEventListener("DOMContentLoaded", function () {
    // Sample products array
    const products = [
      // Sofa category
      { name: "Luxury 3-Seater Sofa", category: "sofa", price: 32999, image: "purchase img/0aaeb1c6-928d-43f1-9e47-7a0ce18a4b69.jpg"},
      { name: "L-Shaped Corner Sofa", category: "sofa", price: 45999, image: "purchase img/ea9df0bc-688f-4ca2-9ed2-25a059dbfd48.jpg" },
      { name: "Recliner Sofa", category: "sofa", price: 38499, image: "purchase img/577427dd-f8d9-496f-b026-84bf7964ef33.jpg" },
      { name: "Fabric 2-Seater Sofa", category: "sofa", price: 24999, image: "purchase img/3f34c5a8-193e-40fc-af5c-21e6e940fedc.jpg" },
      { name: "Wooden Sofa Set", category: "sofa", price: 42999, image: "purchase img/399209d1-ba07-4f05-a630-d2620da83cd5.jpg" },
      
      // Chair category
      { name: "Ergonomic Office Chair", category: "chair", price: 8999, image: "purchase img/6f3a88cd-f3f5-423f-b392-e0d76c8ebd77.jpg" },
      { name: "Wooden Dining Chair", category: "chair", price: 4999, image: "purchase img/529f8f40-1244-4c48-a3a2-18bd693540ba.jpg" },
      { name: "Armchair", category: "chair", price: 11999, image: "purchase img/f5e7b780-5a69-43ac-9b60-c7067c99f72d.jpg" },
      { name: "Rocking Chair", category: "chair", price: 7499, image: "purchase img/2c06f5c2-ed30-49fd-88ff-e60c5986bc3b.jpg" },
      { name: "Accent Chair", category: "chair", price: 9999, image: "purchase img/bff83c02-8de0-4f61-a1b5-dbd655912f28.jpg" },
      
      // Table category
      { name: "Glass Dining Table", category: "table", price: 27999, image: "purchase img/a5d9956b-cd81-426b-a13e-a0546411497a.jpg" },
      { name: "Wooden Coffee Table", category: "table", price: 12999, image: "purchase img/d398a398-d459-420b-8632-742a5f5348a4.jpg" },
      { name: "Study Table", category: "table", price: 9499, image: "purchase img/be86c3d9-2264-4314-b470-ef6eba24cb56.jpg" },
      { name: "Console Table", category: "table", price: 14499, image: "purchase img/1381e1fb-1e64-4397-9454-001683a476ad.jpg" },
      { name: "Side Table", category: "table", price: 6999, image: "purchase img/33ffebc3-94bd-4f7c-81e6-365626cb6c5b.jpg" },
      
      // Bed category
      { name: "King Size Bed", category: "bed", price: 42999, image: "purchase img/7f8a9eda-05f9-4359-a659-e738efe9a822.jpg" },
      { name: "Queen Size Bed", category: "bed", price: 34999, image: "purchase img/7153e2ef-4763-4182-a36e-c3b518641a95.jpg" },
      { name: "Single Bed", category: "bed", price: 19999, image: "purchase img/d5fe9917-f577-4b37-ae04-b7b6297f6eb5.jpg" },
      { name: "Bunk Bed", category: "bed", price: 47999, image: "purchase img/63d38c35-250c-4ede-ab38-320030e3dc88.jpg" },
      { name: "Hydraulic Storage Bed", category: "bed", price: 39999, image: "purchase img/b1171f7f-5e49-4813-a4de-50797173fbb9.jpg" },
      
      // Door category
      { name: "Solid Wood Door", category: "door", price: 18999, image: "purchase img/b6bfce39-9fc2-4fa2-9f5b-61daff96df26.jpg" },
      { name: "Laminated Door", category: "door", price: 12499, image: "purchase img/6a1fce74-97cd-4b9e-be3e-7f5224a141d6.jpg" },
      { name: "Glass Panel Door", category: "door", price: 22999, image: "purchase img/852cda3e-f552-4519-b5f1-013273d68db9.jpg" },
      { name: "PVC Door", category: "door", price: 8999, image: "purchase img/16bb241f-ad3c-45fd-ba04-6f22af05eb60.jpg" },
      { name: "Sliding Door", category: "door", price: 24999, image: "purchase img/b5b076c7-b760-4f57-8b9c-deacd8357be6.jpg" }
    ];
    // Save the products array globally for filtering
    window.allProducts = products;
    displayProducts(products);
  });
  
  function displayProducts(products) {
    const container = document.getElementById("purchase-list");
    container.innerHTML = "";
  
    products.forEach(product => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>₹${product.price.toFixed(2)}</p>
        <button onclick="buyProduct('${product.name}', ${product.price}, '${product.image}')">Buy Now</button>
      `;
      container.appendChild(productDiv);
    });
  }
  
  function filterProducts() {
    const categoryFilter = document.getElementById("category-filter").value;
    const priceFilter = document.getElementById("price-filter").value;
    let filteredProducts = window.allProducts;
  
    if (categoryFilter !== "all") {
      filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
    }
  
    if (priceFilter) {
      filteredProducts = filteredProducts.filter(p => p.price <= Number(priceFilter));
    }
  
    displayProducts(filteredProducts);
  }
  
  function buyProduct(name, price, image) {
    alert("You selected: " + name + " for ₹" + price.toFixed(2));
    // Redirect to buy.html with URL parameters
    window.location.href = `buy.html?name=${encodeURIComponent(name)}&price=${price}&image=${encodeURIComponent(image)}`;
  }
  