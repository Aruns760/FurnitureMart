document.addEventListener("DOMContentLoaded", function () {
  loadSalesItems();
  
  document.getElementById("item-image").addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
              document.getElementById("image-preview").src = e.target.result;
              document.getElementById("image-preview").style.display = "block";
          };
          reader.readAsDataURL(file);
      }
  });

  document.getElementById("sale-form").addEventListener("submit", function(e) {
      e.preventDefault();
      let name = document.getElementById("item-name").value;
      let price = parseFloat(document.getElementById("item-price").value);
      let image = document.getElementById("image-preview").src;
      let description = document.getElementById("item-description").value;

      let saleItem = { name, price, image, description };

      let sales = JSON.parse(localStorage.getItem("sales")) || [];
      sales.push(saleItem);
      localStorage.setItem("sales", JSON.stringify(sales));

      document.getElementById("sale-form").reset();
      document.getElementById("image-preview").style.display = "none";

      loadSalesItems();
  });
});

function loadSalesItems() {
  let sales = JSON.parse(localStorage.getItem("sales")) || [];
  let salesList = document.getElementById("sales-list");
  salesList.innerHTML = "";

  sales.forEach((item, index) => {
      let div = document.createElement("div");
      div.classList.add("sale-item");
      div.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p>₹${item.price.toFixed(2)}</p>
          <p>${item.description}</p>
          <button class="buy-btn" onclick="buyItem('${item.name}', ${item.price}, '${item.image}')">Buy Now</button>
          <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
      `;
      salesList.appendChild(div);
  });
}

function removeItem(index) {
  let sales = JSON.parse(localStorage.getItem("sales")) || [];
  sales.splice(index, 1);
  localStorage.setItem("sales", JSON.stringify(sales));
  loadSalesItems();
}

function buyItem(name, price, image) {
  alert("You selected: " + name + " for ₹" + price.toFixed(2));
  // Redirect to buy.html with URL parameters
  window.location.href = `buy.html?name=${encodeURIComponent(name)}&price=${price}&image=${encodeURIComponent(image)}`;
}

