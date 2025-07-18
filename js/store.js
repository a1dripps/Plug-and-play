// store.js – handles product display and cart logic
document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const storedProducts = JSON.parse(localStorage.getItem('products')) || [];

  function renderProducts(products) {
    if (!productList) return;
    productList.innerHTML = '';

    if (products.length === 0) {
      productList.innerHTML = '<p>No products found.</p>';
      return;
    }

    products.forEach((product, index) => {
      if (!product.enabled) return;

      const card = document.createElement('div');
      card.className = 'product-card';

      card.innerHTML = `
        <img src="${product.image || 'https://via.placeholder.com/300x200'}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="price">$${product.price.toFixed(2)}</p>
          <p>${product.type === 'electronics' ? `Delivery: ${product.deliveryTime || '3–7 days'}` : 'Delivery: 2–24h'}</p>
        </div>
        <div class="product-actions">
          <button onclick="addToCart(${index})">Add to Basket</button>
          <button onclick="buyNow(${index})">Buy Now</button>
        </div>
      `;
      productList.appendChild(card);
    });
  }

  renderProducts(storedProducts);
});

function addToCart(index) {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const item = products[index];

  if (item) {
    cart.push({ ...item, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Item added to basket.');
  }
}

function buyNow(index) {
  const email = prompt('Enter your email to continue:');
  if (!email) return alert('Email is required.');

  const products = JSON.parse(localStorage.getItem('products')) || [];
  const product = products[index];

  if (product && product.stripe) {
    localStorage.setItem('checkoutEmail', email);
    window.location.href = product.stripe;
  } else {
    alert('Checkout not available.');
  }
}
