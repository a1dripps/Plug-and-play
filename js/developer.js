// developer.js

(() => {
  const PIN = "7391";

  // Elements
  const loginSection = document.getElementById("login-section");
  const pinInput = document.getElementById("pin-input");
  const pinSubmit = document.getElementById("pin-submit");
  const pinError = document.getElementById("pin-error");
  const panelContent = document.getElementById("panel-content");

  // Business Info inputs
  const storeNameInput = document.getElementById("store-name");
  const businessEmailInput = document.getElementById("business-email");
  const deliveryDisclaimerInput = document.getElementById("delivery-disclaimer");
  const footerMessageInput = document.getElementById("footer-message");

  // SEO inputs
  const metaTitleInput = document.getElementById("meta-title");
  const metaDescriptionInput = document.getElementById("meta-description");

  // Design controls inputs
  const fontBodySizeInput = document.getElementById("font-body-size");
  const fontHeaderSizeInput = document.getElementById("font-header-size");
  const fontButtonSizeInput = document.getElementById("font-button-size");
  const spacingControlSelect = document.getElementById("spacing-control");
  const buttonStyleSelect = document.getElementById("button-style");
  const shadowToggleInput = document.getElementById("shadow-toggle");

  // Products
  const addProductBtn = document.getElementById("add-product-btn");
  const productsList = document.getElementById("products-list");

  // Admin tools buttons
  const exportBtn = document.getElementById("export-data-btn");
  const importBtn = document.getElementById("import-data-btn");
  const importFileInput = document.getElementById("import-file-input");
  const resetDefaultsBtn = document.getElementById("reset-defaults-btn");

  // Data keys
  const STORAGE_KEY = "pps_data";

  // State
  let data = {
    products: [],
    businessInfo: {
      storeName: "",
      businessEmail: "",
      deliveryDisclaimer: "",
      footerMessage: ""
    },
    seo: {
      title: "",
      description: ""
    },
    design: {
      fontBodySize: 16,
      fontHeaderSize: 28,
      fontButtonSize: 16,
      spacing: "normal",
      buttonStyle: "flat",
      shadowsEnabled: true
    }
  };

  // --- Utils ---
  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        data = Object.assign(data, parsed);
      } catch {
        // corrupt data, ignore
      }
    }
  }

  function createElement(tag, props = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([key, val]) => {
      if (key === "className") el.className = val;
      else if (key === "innerHTML") el.innerHTML = val;
      else if (key.startsWith("on") && typeof val === "function") el.addEventListener(key.slice(2), val);
      else el.setAttribute(key, val);
    });
    children.forEach(c => el.appendChild(c));
    return el;
  }

  // --- PIN Login ---
  pinSubmit.addEventListener("click", () => {
    if (pinInput.value === PIN) {
      pinError.classList.add("hidden");
      loginSection.classList.add("hidden");
      panelContent.classList.remove("hidden");
      loadAllToUI();
    } else {
      pinError.classList.remove("hidden");
    }
  });

  pinInput.addEventListener("keydown", e => {
    if (e.key === "Enter") pinSubmit.click();
  });

  // --- Load all data to UI ---
  function loadAllToUI() {
    // Business info
    storeNameInput.value = data.businessInfo.storeName;
    businessEmailInput.value = data.businessInfo.businessEmail;
    deliveryDisclaimerInput.value = data.businessInfo.deliveryDisclaimer;
    footerMessageInput.value = data.businessInfo.footerMessage;

    // SEO
    metaTitleInput.value = data.seo.title;
    metaDescriptionInput.value = data.seo.description;

    // Design
    fontBodySizeInput.value = data.design.fontBodySize;
    fontHeaderSizeInput.value = data.design.fontHeaderSize;
    fontButtonSizeInput.value = data.design.fontButtonSize;
    spacingControlSelect.value = data.design.spacing;
    buttonStyleSelect.value = data.design.buttonStyle;
    shadowToggleInput.checked = data.design.shadowsEnabled;

    renderProducts();
  }

  // --- Save UI inputs back to data ---
  function saveBusinessInfo() {
    data.businessInfo.storeName = storeNameInput.value.trim();
    data.businessInfo.businessEmail = businessEmailInput.value.trim();
    data.businessInfo.deliveryDisclaimer = deliveryDisclaimerInput.value.trim();
    data.businessInfo.footerMessage = footerMessageInput.value.trim();
    saveData();
  }

  function saveSEO() {
    data.seo.title = metaTitleInput.value.trim();
    data.seo.description = metaDescriptionInput.value.trim();
    saveData();
  }

  function saveDesign() {
    data.design.fontBodySize = Number(fontBodySizeInput.value) || 16;
    data.design.fontHeaderSize = Number(fontHeaderSizeInput.value) || 28;
    data.design.fontButtonSize = Number(fontButtonSizeInput.value) || 16;
    data.design.spacing = spacingControlSelect.value;
    data.design.buttonStyle = buttonStyleSelect.value;
    data.design.shadowsEnabled = shadowToggleInput.checked;
    saveData();
  }

  storeNameInput.addEventListener("change", saveBusinessInfo);
  businessEmailInput.addEventListener("change", saveBusinessInfo);
  deliveryDisclaimerInput.addEventListener("change", saveBusinessInfo);
  footerMessageInput.addEventListener("change", saveBusinessInfo);

  metaTitleInput.addEventListener("change", saveSEO);
  metaDescriptionInput.addEventListener("change", saveSEO);

  fontBodySizeInput.addEventListener("change", saveDesign);
  fontHeaderSizeInput.addEventListener("change", saveDesign);
  fontButtonSizeInput.addEventListener("change", saveDesign);
  spacingControlSelect.addEventListener("change", saveDesign);
  buttonStyleSelect.addEventListener("change", saveDesign);
  shadowToggleInput.addEventListener("change", saveDesign);

  // --- Products management ---

  // Render product list
  function renderProducts() {
    productsList.innerHTML = "";
    if (data.products.length === 0) {
      productsList.textContent = "No products yet.";
      return;
    }
    data.products.forEach((p, i) => {
      const productDiv = createElement("div", { className: "product-item" });

      // Image preview
      const img = createElement("img", { className: "product-image", src: p.image || "", alt: p.name || "Product image" });
      productDiv.appendChild(img);

      // Info and inputs container
      const infoDiv = createElement("div", { style: "flex:1;" });

      // Name input
      const nameLabel = createElement("label", { innerHTML: "Name" });
      const nameInput = createElement("input", { type: "text", value: p.name || "" });
      nameInput.addEventListener("input", e => {
        data.products[i].name = e.target.value;
        saveData();
      });
      infoDiv.appendChild(nameLabel);
      infoDiv.appendChild(nameInput);

      // Description textarea
      const descLabel = createElement("label", { innerHTML: "Description" });
      const descInput = createElement("textarea");
      descInput.value = p.description || "";
      descInput.addEventListener("input", e => {
        data.products[i].description = e.target.value;
        saveData();
      });
      infoDiv.appendChild(descLabel);
      infoDiv.appendChild(descInput);

      // Price input
      const priceLabel = createElement("label", { innerHTML: "Price (USD)" });
      const priceInput = createElement("input", { type: "number", min: "0", step: "0.01", value: p.price || 0 });
      priceInput.addEventListener("input", e => {
        data.products[i].price = parseFloat(e.target.value) || 0;
        saveData();
      });
      infoDiv.appendChild(priceLabel);
      infoDiv.appendChild(priceInput);

      // Stripe link input
      const stripeLabel = createElement("label", { innerHTML: "Stripe Link" });
      const stripeInput = createElement("input", { type: "url", value: p.stripeLink || "" });
      stripeInput.addEventListener("input", e => {
        data.products[i].stripeLink = e.target.value.trim();
        saveData();
      });
      infoDiv.appendChild(stripeLabel);
      infoDiv.appendChild(stripeInput);

      // Image URL input
      const imageLabel = createElement("label", { innerHTML: "Image URL" });
      const imageInput = createElement("input", { type: "url", value: p.image || "" });
      imageInput.addEventListener
