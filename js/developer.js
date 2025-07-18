(() => {
  const DEV_PIN = "7391";

  // Elements
  const pinEntry = document.getElementById("pinEntry");
  const pinInput = document.getElementById("pinInput");
  const pinSubmitBtn = document.getElementById("pinSubmitBtn");
  const pinError = document.getElementById("pinError");
  const devPanelMain = document.getElementById("devPanelMain");

  // Store settings inputs
  const storeNameInput = document.getElementById("storeNameInput");
  const businessEmailInput = document.getElementById("businessEmailInput");
  const deliveryDisclaimerInput = document.getElementById("deliveryDisclaimerInput");
  const footerMessageInput = document.getElementById("footerMessageInput");

  // SEO inputs
  const seoTitleInput = document.getElementById("seoTitleInput");
  const seoDescriptionInput = document.getElementById("seoDescriptionInput");

  // Theme & Design inputs
  const fontSizeBody = document.getElementById("fontSizeBody");
  const fontSizeHeaders = document.getElementById("fontSizeHeaders");
  const fontSizeButtons = document.getElementById("fontSizeButtons");
  const spacingPreset = document.getElementById("spacingPreset");
  const buttonStyle = document.getElementById("buttonStyle");
  const shadowToggle = document.getElementById("shadowToggle");

  // Products UI
  const addProductBtn = document.getElementById("addProductBtn");
  const exportJsonBtn = document.getElementById("exportJsonBtn");
  const importJsonBtn = document.getElementById("importJsonBtn");
  const resetDefaultsBtn = document.getElementById("resetDefaultsBtn");
  const importFileInput = document.getElementById("importFileInput");
  const productList = document.getElementById("productList");

  // Keys for localStorage
  const STORAGE_KEYS = {
    unlocked: "devPanelUnlocked",
    products: "ppsProducts",
    settings: "ppsSettings",
    theme: "ppsTheme",
  };

  // Default products sample
  const defaultProducts = [
    {
      id: generateId(),
      name: "Example Game Account",
      description: "An amazing game account with premium items.",
      price: 19.99,
      type: "gameaccount",
      image: "https://via.placeholder.com/250x140?text=Game+Account",
      stripe: "",
      stock: 5,
      enabled: true,
      deliveryTime: "2-24h",
    },
    {
      id: generateId(),
      name: "Wireless Headphones",
      description: "High quality wireless headphones with noise cancellation.",
      price: 59.99,
      type: "electronics",
      image: "https://via.placeholder.com/250x140?text=Headphones",
      stripe: "",
      stock: 10,
      enabled: true,
      deliveryTime: "3-5 days",
    },
  ];

  // Default store settings
  const defaultSettings = {
    storeName: "Plug & Play Shop",
    businessEmail: "support@plugandplayshop.com",
    deliveryDisclaimer: "Delivery times may vary between 2 hours to 24 hours for game accounts, electronics delivery 3-5 business days.",
    footerMessage: "Thank you for shopping with us!",
    seoTitle: "Plug & Play Shop - Premium Game Accounts & Electronics",
    seoDescription: "Buy premium game accounts and quality electronics instantly. Safe, reliable, and fast delivery.",
    fontSizeBody: 16,
    fontSizeHeaders: 28,
    fontSizeButtons: 16,
    spacingPreset: "medium",
    buttonStyle: "flat",
    shadowToggle: true,
  };

  // ===== Initialization =====

  function init() {
    // Check if unlocked
    if (localStorage.getItem(STORAGE_KEYS.unlocked) === "true") {
      unlockPanel();
    } else {
      showPinEntry();
    }

    // Bind events
    pinSubmitBtn.addEventListener("click", checkPin);
    pinInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") checkPin();
    });

    addProductBtn.addEventListener("click", addNewProduct);
    exportJsonBtn.addEventListener("click", exportProductsJSON);
    importJsonBtn.addEventListener("click", () => importFileInput.click());
    importFileInput.addEventListener("change", importProductsJSON);
    resetDefaultsBtn.addEventListener("click", resetAllDefaults);

    // Bind setting inputs change events
    storeNameInput.addEventListener("input", saveSettingsDebounced);
    businessEmailInput.addEventListener("input", saveSettingsDebounced);
    deliveryDisclaimerInput.addEventListener("input", saveSettingsDebounced);
    footerMessageInput.addEventListener("input", saveSettingsDebounced);
    seoTitleInput.addEventListener("input", saveSettingsDebounced);
    seoDescriptionInput.addEventListener("input", saveSettingsDebounced);

    fontSizeBody.addEventListener("input", saveSettingsDebounced);
    fontSizeHeaders.addEventListener("input", saveSettingsDebounced);
    fontSizeButtons.addEventListener("input", saveSettingsDebounced);
    spacingPreset.addEventListener("change", saveSettingsDebounced);
    buttonStyle.addEventListener("change", saveSettingsDebounced);
    shadowToggle.addEventListener("change", saveSettingsDebounced);
  }

  // ===== PIN unlock logic =====
  function checkPin() {
    const val = pinInput.value.trim();
    if (val === DEV_PIN) {
      localStorage.setItem(STORAGE_KEYS.unlocked, "true");
      unlockPanel();
    } else {
      pinError.style.display = "block";
      pinInput.value = "";
      pinInput.focus();
    }
  }

  function showPinEntry() {
    pinEntry.style.display = "block";
    devPanelMain.style.display = "none";
    pinInput.focus();
  }

  function unlockPanel() {
    pinEntry.style.display = "none";
    devPanelMain.style.display = "block";

    loadSettings();
    loadProducts();
  }

  // ===== Products handling =====

  function generateId() {
    return "prod-" + Math.random().toString(36).slice(2, 10);
  }

  function loadProducts() {
    productList.innerHTML = "";
    let products = getProducts();
    if (!products || !Array.isArray(products) || products.length === 0) {
      products = defaultProducts;
      saveProducts(products);
    }

    products.forEach((p, index) => {
      const prodEl = createProductElement(p, index);
      productList.appendChild(prodEl);
    });
  }

  function getProducts() {
    const raw = localStorage.getItem(STORAGE_KEYS.products);
    try {
      return JSON.parse(raw) || [];
    } catch {
      return [];
    }
  }

  function saveProducts(products) {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  }

  function createProductElement(product, index) {
    const container = document.createElement("div");
    container.className = "product-edit-container";
    container.style = "border:1px solid #666; padding:1rem; margin-bottom:1rem; background:#222; border-radius:8px; color:#eee;";

    // Enable toggle
    const enabledLabel = document.createElement("label");
    enabledLabel.style = "display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;";
    const enabledCheckbox = document.createElement("input");
    enabledCheckbox.type = "checkbox";
    enabledCheckbox.checked = product.enabled;
    enabledCheckbox.title = "Enable / Disable this product";
    enabledLabel.appendChild(enabledCheckbox);
    enabledLabel.appendChild(document.createTextNode("Enabled"));
    container.appendChild(enabledLabel);

    // Name
    container.appendChild(makeLabeledInput("Name:", "text", product.name, (val) => {
      product.name = val; saveProductAtIndex(index, product);
    }));

    // Description (textarea)
    container.appendChild(makeLabeledTextarea("Description:", product.description, (val) => {
      product.description = val; saveProductAtIndex(index, product);
    }));

    // Price
    container.appendChild(makeLabeledInput("Price ($):", "number", product.price, (val) => {
      product.price = parseFloat(val) || 0; saveProductAtIndex(index, product);
    }));

    // Type (select)
    container.appendChild(makeLabeledSelect("Type:", ["gameaccount", "electronics"], product.type, (val) => {
      product.type = val; saveProductAtIndex(index, product);
    }));

    // Image URL
    container.appendChild(makeLabeledInput("Image URL:", "url", product.image, (val) => {
      product.image = val; saveProductAtIndex(index, product);
    }));

    // Stripe Link
    container.appendChild(makeLabeledInput("Stripe Link:", "url", product.stripe, (val) => {
      product.stripe = val; saveProductAtIndex(index, product);
    }));

    // Stock Quantity
    container.appendChild(makeLabeledInput
