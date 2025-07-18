document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("selectedTheme") || "light";
  applyTheme(savedTheme);
});

function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);

  switch (theme) {
    case "light":
      setThemeVars("#ffffff", "#000000", "#0d6efd");
      break;
    case "neon-blue":
      setThemeVars("#0a0a0a", "#00ffff", "#00bfff");
      break;
    case "dark-red":
      setThemeVars("#1a0000", "#ff4d4d", "#ff1a1a");
      break;
    default:
      setThemeVars("#ffffff", "#000000", "#0d6efd");
  }
}

function setThemeVars(bg, text, accent) {
  const root = document.documentElement;
  root.style.setProperty("--bg-color", bg);
  root.style.setProperty("--text-color", text);
  root.style.setProperty("--accent-color", accent);
}
