// js/cart.js

document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElem = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your basket is empty.</p>";
      cartTotalElem.textContent = "0.00";
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      total += item.price;

      const itemElem = document.createElement("div");
      itemElem.className = "cart-item";

      itemElem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>$${item.price.toFixed(2)}</p>
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      `;

      cartItemsContainer.appendChild(itemElem);
    });

    cartTotalElem.textContent = total.toFixed(2);

    // Add remove button listeners
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = e.target.getAttribute("data-index");
        cart.splice(idx, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });
  }

  renderCart();
});
