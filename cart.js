document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.getElementById('cartItems');
  const totalDisplay = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  function updateCart() {
    cartContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartContainer.innerHTML = '<p>Your basket is empty.</p>';
      totalDisplay.textContent = '$0.00';
      checkoutBtn.disabled = true;
      return;
    }

    cart.forEach((item, index) => {
      total += item.price;

      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <p>${item.name} - $${item.price}</p>
        <button data-index="${index}">Remove</button>
      `;

      row.querySelector('button').onclick = () => {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
      };

      cartContainer.appendChild(row);
    });

    totalDisplay.textContent = `$${total.toFixed(2)}`;
    checkoutBtn.disabled = false;
  }

  checkoutBtn.onclick = () => {
    const email = localStorage.getItem('customerEmail');
    if (!email || !email.includes('@')) {
      alert('Please enter your email before checking out.');
      return;
    }
    window.location.href = 'checkout.html';
  };

  updateCart();
});
