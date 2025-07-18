// js/store.js - Handles loading and displaying products, cart logic

const productsContainer = document.getElementById('productsContainer');
const cartCountElem = document.getElementById('cartCount');

// --- Utilities ---
function getProducts() {
  const data = localStorage.getItem('products');
  if (!data) return [];
  try {
    return JSON.parse(data).filter(p => p.enabled !== false);
  } catch {
    return [];
  }
}

function getCart() {
  const data = localStorage.getItem('cart');
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountElem) cartCountElem.textContent = total > 0 ? total : '';
}

// --- Cart Actions ---
function addToCart(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return alert("Product not found!");

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart(cart);
  alert(`Added "${product.name}" to your basket.`);
}

function buyNow(productId) {
  const email = prompt("Enter your email to continue:");
  if (!email || !email.includes('@')) {
    alert("Please enter a valid email.");
    return;
  }
  sessionStorage.setItem('purchaseEmail', email);

  const product = getProducts().find(p => p.id === productId);
  if (!product) return alert("Product not found!");

  if (product.stripeLink) {
    window.location.href = product.stripeLink;
  } else {
    alert("Stripe link is not set.");
  }
}

// --- Render Products ---
function renderProducts() {
  const products = getProducts();
  if (!productsContainer) return;

  if (!products.length) {
    productsContainer.innerHTML = `<p>No products available yet.</p>`;
    return;
  }

  productsContainer.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.imageUrl || 'https://via.placeholder.com/300x160?text=No+Image'}" alt="${p.name}" class="product-image" />
      <h3 class="product-name">${p.name}</h3>
      <p class="product-desc">${p.description}</p>
      <p class="product-price">$${p.price.toFixed(2)}</p>
      <div class="product-buttons">
        <button class="btn-add" onclick="addToCart('${p.id}')">Add to Basket</button>
        <button class="btn-buy" onclick="buyNow('${p.id}')">Buy Now</button>
      </div>
    </div>
  `).join('');
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartCount();
});
