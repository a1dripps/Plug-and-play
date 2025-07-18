// store.js - loads products, manages cart count and buttons

const productsContainer = document.getElementById('productsContainer');
const cartCountElem = document.getElementById('cartCount');

function getProducts() {
  // Load products from localStorage (developer panel sets this)
  const productsJSON = localStorage.getItem('products');
  if (!productsJSON) return [];
  try {
    return JSON.parse(productsJSON);
  } catch {
    return [];
  }
}

function renderProducts() {
  const products = getProducts();
  if (!products.length) {
    productsContainer.innerHTML = `<p>No products available right now.</p>`;
    return;
  }
  productsContainer.innerHTML =
