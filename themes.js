function setTheme(theme) {
  document.body.className = theme;
  localStorage.setItem("site-theme", theme);
}

function loadTheme() {
  const theme = localStorage.getItem("site-theme") || "theme-light";
  document.body.className = theme;
}

window.onload = loadTheme;
