(() => {
  const THEME_KEY = "plugplay-theme";

  const applyTheme = (theme) => {
    document.body.classList.remove("theme-light", "theme-neon", "theme-red");
    document.body.classList.add(`theme-${theme}`);
  };

  // Load and apply saved theme on every page
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);

  // On themes.html: handle theme selection and saving
  const previews = document.querySelectorAll(".theme-preview");
  const saveButton = document.getElementById("save-theme");
  const selectedThemeDisplay = document.getElementById("selected-theme");

  if (previews && previews.length > 0) {
    previews.forEach(preview => {
      preview.addEventListener("click", () => {
        const chosen = preview.dataset.theme;
        applyTheme(chosen);
        localStorage.setItem(THEME_KEY, chosen);
        selectedThemeDisplay.textContent = `Selected: ${chosen}`;
      });
    });

    if (saveButton) {
      saveButton.addEventListener("click", () => {
        alert("Theme saved!");
      });
    }
  }
})();
