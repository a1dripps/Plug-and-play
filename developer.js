(() => {
  const PIN = "7391";
  const STORAGE_KEY = "plugplay-site-data";
  const loginScreen = document.getElementById("dev-login");
  const panel = document.getElementById("dev-panel");
  const pinInput = document.getElementById("pin-input");
  const productsList = document.getElementById("products-list");
  const addProductBtn = document.getElementById("add-product");
  const exportBtn = document.getElementById("export-data");
  const importBtn = document.getElementById("import-data");
  const importFileInput = document.getElementById("import-file");
  const resetDefaultsBtn = document.getElementById("reset-defaults");
  const reorderUp = (i) => { if (i > 0) { [data.products[i - 1], data.products[i]] = [data.products[i], data.products[i - 1]]; renderProducts(); saveData(); }};
  const reorderDown = (i) => { if (i < data.products.length - 1) { [data.products[i + 1], data.products[i]] = [data.products[i], data.products[i + 1]]; renderProducts(); saveData(); }};
  let data = { products: [], settings: {} };

  // Helpers
  const saveData = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  const loadData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) data = JSON.parse(stored);
    } catch {}
    if (!data.products) data.products = [];
    if (!data.settings) data.settings = {};
    loadAllToUI();
  };

  const createElement = (tag, attrs = {}) => {
    const el = document.createElement(tag);
    for (let key in attrs) {
      if (key === "innerHTML") el.innerHTML = attrs[key];
      else if (key === "onclick") el.onclick = attrs[key];
      else el.setAttribute(key, attrs[key]);
    }
    return el;
  };

  // Load settings inputs
  function loadAllToUI() {
    document.getElementById("store-name").value = data.settings.storeName || "";
    document.getElementById("store-email").value = data.settings.email || "";
    document.getElementById("electronics-time").value = data.settings.electronicsTime || "";
    document.getElementById("disclaimer").value = data.settings.disclaimer || "";
    document.getElementById("footer-message").value = data.settings.footerMessage || "";
    document.getElementById("site-title").value = data.settings.siteTitle || "";
    document.getElementById("site-description").value = data.settings.siteDescription || "";
    document.getElementById("font-size-body").value = data.settings.fontSizeBody || "16";
    document.getElementById("font-size-header").value = data.settings.fontSizeHeader || "20";
    document.getElementById("font-size-button").value = data.settings.fontSizeButton || "16";
    document.getElementById("padding").value = data.settings.padding || "10";
    document.getElementById("margin").value = data.settings.margin || "10";
    document.getElementById("button-style").value = data.settings.buttonStyle || "flat";
    document.getElementById("shadows").checked = !!data.settings.shadows;
    renderProducts();
  }

  // Save settings
  document.querySelectorAll(".setting-input").forEach(input => {
    input.addEventListener("input", () => {
      data.settings.storeName = document.getElementById("store-name").value;
      data.settings.email = document.getElementById("store-email").value;
      data.settings.electronicsTime = document.getElementById("electronics-time").value;
      data.settings.disclaimer = document.getElementById("disclaimer").value;
      data.settings.footerMessage = document.getElementById("footer-message").value;
      data.settings.siteTitle = document.getElementById("site-title").value;
      data.settings.siteDescription = document.getElementById("site-description").value;
      data.settings.fontSizeBody = document.getElementById("font-size-body").value;
      data.settings.fontSizeHeader = document.getElementById("font-size-header").value;
      data.settings.fontSizeButton = document.getElementById("font-size-button").value;
      data.settings.padding = document.getElementById("padding").value;
      data.settings.margin = document.getElementById("margin").value;
      data.settings.buttonStyle = document.getElementById("button-style").value;
      data.settings.shadows = document.getElementById("shadows").checked;
      saveData();
    });
  });

  // Render all products
  function renderProducts() {
    productsList.innerHTML = "";
    data.products.forEach((p, i) => {
      const productDiv = createElement("div", { className: "product-entry" });
      const infoDiv = createElement("div", { className: "product-info" });

      const nameInput = createElement("input", { value: p.name });
      nameInput.addEventListener("input", e => {
        data.products[i].name = e.target.value;
        saveData();
      });
      const descInput = createElement("textarea", { innerHTML: p.description });
      descInput.addEventListener("input", e => {
        data.products[i].description = e.target.value;
        saveData();
      });
      const priceInput = createElement("input", { type: "number", value: p.price });
      priceInput.addEventListener("input", e => {
        data.products[i].price = parseFloat(e.target.value) || 0;
        saveData();
      });
      const stripeInput = createElement("input", { value: p.stripeLink });
      stripeInput.addEventListener("input", e => {
        data.products[i].stripeLink = e.target.value;
        saveData();
      });
      const imageInput = createElement("input", { value: p.image });
      imageInput.addEventListener("input", e => {
        data.products[i].image = e.target.value;
        saveData();
      });

      const stockInput = createElement("input", { type: "number", value: p.stock || 0 });
      stockInput.addEventListener("input", e => {
        data.products[i].stock = parseInt(e.target.value) || 0;
        saveData();
      });

      const typeSelect = createElement("select");
      ["Game Account", "Electronics"].forEach(t => {
        const opt = createElement("option", { value: t, innerHTML: t });
        if (t === p.type) opt.selected = true;
        typeSelect.appendChild(opt);
      });
      typeSelect.addEventListener("change", e => {
        data.products[i].type = e.target.value;
        saveData();
      });

      const enableToggle = createElement("input", { type: "checkbox" });
      enableToggle.checked = p.enabled !== false;
      enableToggle.addEventListener("change", e => {
        data.products[i].enabled = e.target.checked;
        saveData();
      });

      const img = createElement("img", { src: p.image, className: "preview-img" });

      const upBtn = createElement("button", { innerHTML: "↑", onclick: () => reorderUp(i) });
      const downBtn = createElement("button", { innerHTML: "↓", onclick: () => reorderDown(i) });
      const dupBtn = createElement("button", {
        innerHTML: "Duplicate",
        onclick: () => {
          data.products.splice(i + 1, 0, { ...p });
          saveData();
          renderProducts();
        }
      });
      const delBtn = createElement("button", {
        innerHTML: "Remove",
        onclick: () => {
          if (confirm("Delete this product?")) {
            data.products.splice(i, 1);
            saveData();
            renderProducts();
          }
        }
      });

      infoDiv.appendChild(nameInput);
      infoDiv.appendChild(descInput);
      infoDiv.appendChild(priceInput);
      infoDiv.appendChild(stripeInput);
      infoDiv.appendChild(imageInput);
      infoDiv.appendChild(img);
      infoDiv.appendChild(typeSelect);
      infoDiv.appendChild(stockInput);
      infoDiv.appendChild(enableToggle);
      infoDiv.appendChild(upBtn);
      infoDiv.appendChild(downBtn);
      infoDiv.appendChild(dupBtn);
      infoDiv.appendChild(delBtn);

      productDiv.appendChild(infoDiv);
      productsList.appendChild(productDiv);
    });
  }

  addProductBtn.addEventListener("click", () => {
    data.products.push({
      name: "New Product",
      description: "",
      price: 0,
      stripeLink: "",
      image: "",
      type: "Game Account",
      stock: 0,
      enabled: true
    });
    saveData();
    renderProducts();
  });

  exportBtn.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "plugplay-backup.json";
    a.click();
  });

  importBtn.addEventListener("click", () => importFileInput.click());
  importFileInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.products) {
          data = imported;
          saveData();
          loadAllToUI();
        } else {
          alert("Invalid JSON structure.");
        }
      } catch {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  });

  resetDefaultsBtn.addEventListener("click", () => {
    if (confirm("Reset all settings and products?")) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });

  // PIN unlock
  pinInput.addEventListener("input", () => {
    if (pinInput.value === PIN) {
      loginScreen.style.display = "none";
      panel.style.display = "block";
      loadData();
    }
  });

})();
