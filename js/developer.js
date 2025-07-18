// developer.js
(() => {
  const PIN = "7391";
  const STORAGE_KEY = "plugPlayDevPanel";
  const PRODUCTS_KEY = "plugPlayProducts";
  const SETTINGS_KEY = "plugPlaySettings";

  // Elements
  const pinInput = document.getElementById("devPin");
  const unlockBtn = document.getElementById("unlockBtn");
  const loginSection = document.getElementById("loginSection");
  const panelSection = document.getElementById("panelSection");
  const logoutBtn = document.getElementById("logoutBtn");
  const messageBox = document.getElementById("messageBox");

  // Product form elements
  const productListContainer = document.getElementById("productList");
  const addProductBtn = document.getElementById("addProductBtn");

  // Settings form elements
  const storeNameInput = document.getElementById("storeName");
  const businessEmailInput = document.getElementById("businessEmail");
  const deliveryDisclaimerInput = document.getElementById("deliveryDisclaimer");
  const footerMessageInput = document.getElementById("footerMessage");
  const siteTitleInput = document.getElementById("siteTitle");
  const siteDescriptionInput = document.getElementById("siteDescription");

  // Theme & design controls
  const themeSelect = document.getElementById("themeSelect");
  const fontSizeBodyInput = document.getElementById("fontSizeBody");
  const fontSizeHeadersInput = document.getElementById("fontSizeHeaders");
  const fontSizeButtonsInput = document.getElementById("fontSizeButtons");
  const spacingControl = document.getElementById("spacingControl");
  const buttonStyleSelect = document.getElementById("buttonStyleSelect");
  const shadowToggle = document.getElementById("shadowToggle");

  // Utility functions
  function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function loadData(key, fallback = null) {
    const d = localStorage.getItem(key);
    return d ? JSON.parse(d) : fallback;
  }

  function showMessage(msg, isError = false) {
    messageBox.textContent = msg;
    messageBox.style.color = isError ? "red" : "green";
    setTimeout(() => (messageBox.textContent = ""), 4000);
  }

  // Authentication
  function unlockPanel() {
    if (pinInput.value === PIN) {
      loginSection.style.display = "none";
      panelSection.style.display = "block";
      loadPanelData();
      showMessage("Developer panel unlocked!");
    } else {
      showMessage("Incorrect PIN", true);
    }
  }

  function logoutPanel() {
    loginSection.style.display = "block";
    panelSection.style.display = "none";
    pinInput.value = "";
  }

  // Product Management
  let products = loadData(PRODUCTS_KEY, []);

  function saveProducts() {
    saveData(PRODUCTS_KEY, products);
  }

  function createProductElement(product, index) {
    const container = document.createElement("div");
    container.className = "product-edit-container";

    container.innerHTML = `
      <input type="text" class="product-name" placeholder="Name" value="${product.name}" />
      <textarea class="product-desc" placeholder="Description">${product.description}</textarea>
      <input type="text" class="product-price" placeholder="Price" value="${product.price}" />
      <input type="text" class="product-image" placeholder="Image URL" value="${product.image}" />
      <select class="product-type">
        <option value="game" ${product.type === "game" ? "selected" : ""}>Game Account</option>
        <option value="electronics" ${product.type === "electronics" ? "selected" : ""}>Electronics</option>
      </select>
      <input type="text" class="product-stripe" placeholder="Stripe Link" value="${product.stripeLink}" />
      <input type="number" class="product-stock" placeholder="Stock Qty" min="0" value="${product.stock || 0}" />
      <button class="btn-update">Update</button>
      <button class="btn-duplicate">Duplicate</button>
      <button class="btn-move-up">↑</button>
      <button class="btn-move-down">↓</button>
      <button class="btn-delete">Delete</button>
    `;

    // Event listeners for buttons
    container.querySelector(".btn-update").onclick = () => {
      products[index].name = container.querySelector(".product-name").value.trim();
      products[index].description = container.querySelector(".product-desc").value.trim();
      products[index].price = parseFloat(container.querySelector(".product-price").value) || 0;
      products[index].image = container.querySelector(".product-image").value.trim();
      products[index].type = container.querySelector(".product-type").value;
      products[index].stripeLink = container.querySelector(".product-stripe").value.trim();
      products[index].stock = parseInt(container.querySelector(".product-stock").value) || 0;
      saveProducts();
      showMessage("Product updated");
      renderProductList();
      updateLiveStorefront();
    };

    container.querySelector(".btn-duplicate").onclick = () => {
      const copy = { ...products[index] };
      products.splice(index + 1, 0, copy);
      saveProducts();
      showMessage("Product duplicated");
      renderProductList();
      updateLiveStorefront();
    };

    container.querySelector(".btn-move-up").onclick = () => {
      if (index === 0) return;
      const temp = products[index - 1];
      products[index - 1] = products[index];
      products[index] = temp;
      saveProducts();
      renderProductList();
      updateLiveStorefront();
    };

    container.querySelector(".btn-move-down").onclick = () => {
      if (index === products.length - 1) return;
      const temp = products[index + 1];
      products[index + 1] = products[index];
      products[index] = temp;
      saveProducts();
      renderProductList();
      updateLiveStorefront();
    };

    container.querySelector(".btn-delete").onclick = () => {
      if (confirm("Delete this product?")) {
        products.splice(index, 1);
        saveProducts();
        showMessage("Product deleted");
        renderProductList();
        updateLiveStorefront();
      }
    };

    return container;
  }

  function renderProductList() {
    productListContainer.innerHTML = "";
    if (products.length === 0) {
      productListContainer.textContent = "No products yet.";
      return;
    }
    products.forEach((prod, i) => {
      productListContainer.appendChild(createProductElement(prod, i));
    });
  }

  function addNewProduct() {
    products.push({
      name: "",
      description: "",
      price: 0,
      image: "",
      type: "game",
      stripeLink: "",
      stock: 0,
    });
    saveProducts();
    renderProductList();
  }

  // Design Controls and Settings
  let settings = loadData(SETTINGS_KEY, {
    storeName: "Plug & Play Shop",
    businessEmail: "support@example.com",
    deliveryDisclaimer: "Delivery times vary by product type.",
    footerMessage: "All sales final.",
    siteTitle: "Plug & Play Shop",
    siteDescription: "Your ultimate store for game accounts and electronics.",
    theme: "light",
    fontSizes: { body: "16px", headers: "24px", buttons: "16px" },
    spacing: "normal",
    buttonStyle: "flat",
    shadow: true,
  });

  function saveSettings() {
    saveData(SETTINGS_KEY, settings);
  }

  function loadPanelData() {
    // Load settings into inputs
    storeNameInput.value = settings.storeName;
    businessEmailInput.value = settings.businessEmail;
    deliveryDisclaimerInput.value = settings.deliveryDisclaimer;
    footerMessageInput.value = settings.footerMessage;
    siteTitleInput.value = settings.siteTitle;
    siteDescriptionInput.value = settings.siteDescription;

    themeSelect.value = settings.theme;
    fontSizeBodyInput.value = settings.fontSizes.body;
    fontSizeHeadersInput.value = settings.fontSizes.headers;
    fontSizeButtonsInput.value = settings.fontSizes.buttons;
    spacingControl.value = settings.spacing;
    buttonStyleSelect.value = settings.buttonStyle;
    shadowToggle.checked = settings.shadow;

    renderProductList();
  }

  function updateLiveStorefront() {
    // Save products and settings so other parts of the site can load them
    saveProducts();
    saveSettings();
    // Dispatch custom event for live update if needed
    document.dispatchEvent(new CustomEvent("storeUpdated"));
  }

  // Event Listeners for settings inputs
  storeNameInput.addEventListener("change", () => {
    settings.storeName = storeNameInput.value.trim();
    saveSettings();
    updateLiveStorefront();
  });

  businessEmailInput.addEventListener("change", () => {
    settings.businessEmail = businessEmailInput.value.trim();
    saveSettings();
    updateLiveStorefront();
  });

  deliveryDisclaimerInput.addEventListener("change", () => {
    settings.deliveryDisclaimer = deliveryDisclaimerInput.value.trim();
    saveSettings();
    updateLiveStorefront();
  });

  footerMessageInput.addEventListener("change", () => {
    settings.footerMessage = footerMessageInput.value.trim();
    saveSettings();
    updateLiveStorefront();
  });

  siteTitleInput.addEventListener("change", () => {
    settings.siteTitle = siteTitleInput.value.trim();
    saveSettings();
    updateLiveStorefront();
  });

  siteDescriptionInput.addEventListener("change", () => {
    settings.siteDescription = siteDescriptionInput.value.trim();
    saveSettings();
    updateLiveStorefront();
  });

  themeSelect.addEventListener("change", () => {
    settings.theme = themeSelect.value;
    saveSettings();
    updateLiveStorefront();
  });

  fontSizeBodyInput.addEventListener("change", () => {
    settings.fontSizes.body = fontSizeBodyInput.value.trim();
    saveSettings();
    updateLiveStorefront();
  });

  fontSizeHeadersInput.addEventListener("change", () => {
    settings.fontSizes.headers = fontSizeHeadersInput.value.trim();
    saveSettings();
    updateLiveStorefront();
  });

  fontSizeButtonsInput.addEventListener("change", () => {
    settings.fontSizes.buttons = fontSizeButtonsInput.value.trim();
    saveSettings();
    updateLiveStorefront();
  });

  spacingControl.addEventListener("change", () => {
    settings.spacing = spacingControl.value;
    saveSettings();
    updateLiveStorefront();
  });

  buttonStyleSelect.addEventListener("change", () => {
    settings.buttonStyle = buttonStyleSelect.value;
    saveSettings();
    updateLiveStorefront();
  });

  shadowToggle.addEventListener("change", () => {
    settings.shadow = shadowToggle.checked;
    saveSettings();
    updateLiveStorefront();
  });

  // Buttons
  unlockBtn.onclick = unlockPanel;
  logoutBtn.onclick = logoutPanel;
  addProductBtn.onclick = () => {
    addNewProduct();
    showMessage("New product added");
  };

  // Initialize
  logoutPanel(); // show login first

})();
