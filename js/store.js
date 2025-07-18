document.addEventListener("DOMContentLoaded", () => {
  const productContainer = document.getElementById("product-list");
  const cartCount = document.getElementById("cart-count");
  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = count > 0 ? count : "";
  }

  function renderProducts() {
    productContainer.innerHTML = "";

    const enabledProducts = products.filter(p => p.enabled);
    if (enabledProducts.length === 0) {
      productContainer.innerHTML = `<p class="no-products">No products available.</p>`;
      return;
    }

    enabledProducts.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${product.image || 'https://via.placeholder.com/300x200'}" alt="${product.name}" />
        <h2>${product.name}</h2>
        <p class="price">$${product.price.toFixed(2)}</p>
        <div class="actions">
          <button class="add-to-cart" data-id="${product.id}">Add to Basket</button>
          <a href="checkout.html?id=${product.id}" class="buy-now">Buy Now</a>
        </div>
      `;

      productContainer.appendChild(card);
    });

    document.querySelectorAll(".add-to-cart").forEach(button => {
      button.addEventListener("click", e => {
        const id = parseInt(e.target.dataset.id);
        const existing = cart.find(item => item.id === id);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ id, quantity: 1 });
        }
        saveCart();
        alert("Item added to basket.");
      });
    });
  }

  // Theme restore
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.className = savedTheme;
  }

  updateCartCount();
  renderProducts();
});
