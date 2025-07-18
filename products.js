document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('productList');
  const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
  const products = storedProducts.filter(p => p.enabled !== false);

  const emailPrompt = () => {
    let email = prompt("Enter your email to continue:");
    if (!email || !email.includes('@')) {
      alert("Invalid email.");
      return null;
    }
    localStorage.setItem('customerEmail', email);
    return email;
  };

  products.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product';
    card.innerHTML = `
      <img src="${prod.image || 'https://via.placeholder.com/250x150'}" alt="${prod.name}" />
      <h3>${prod.name}</h3>
      <p>$${prod.price}</p>
      <p>${prod.description}</p>
      <button class="buyBtn">Buy Now</button>
      <button class="addCartBtn">Add to Basket</button>
    `;

    card.querySelector('.buyBtn').onclick = () => {
      const email = emailPrompt();
      if (!email) return;
      if (!prod.stripe) return alert("No Stripe link set for this product.");
      window.location.href = prod.stripe;
    };

    card.querySelector('.addCartBtn').onclick = () => {
      const basket = JSON.parse(localStorage.getItem('cart') || '[]');
      basket.push({ id: prod.id, name: prod.name, price: prod.price });
      localStorage.setItem('cart', JSON.stringify(basket));
      alert("Added to basket.");
    };

    container.appendChild(card);
  });
});
