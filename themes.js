// themes.js

// Available themes
const themes = ['theme-light', 'theme-neon-blue', 'theme-dark-neon-red'];

// Apply the theme to <html>
function applyTheme(theme) {
  if (!themes.includes(theme)) theme = 'theme-light';
  document.documentElement.className = theme;
}

// Load saved theme or default
function loadTheme() {
  const saved = localStorage.getItem('defaultTheme') || 'theme-light';
  applyTheme(saved);
}

// Listen for theme changes on any page that has theme selectors (optional)
function setupThemeSelectors() {
  const radios = document.querySelectorAll('input[name="theme"]');
  radios.forEach(radio => {
    radio.addEventListener('change', e => {
      applyTheme(e.target.value);
    });
  });
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  setupThemeSelectors();
});
