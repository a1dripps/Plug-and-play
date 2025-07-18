// themes.js

const themeKey = 'selectedTheme';

// Available themes
const themes = {
  light: {
    name: 'Light',
    className: 'theme-light',
  },
  neonBlue: {
    name: 'Neon Blue',
    className: 'theme-neon-blue',
  },
  darkNeonRed: {
    name: 'Dark Neon Red',
    className: 'theme-dark-neon-red',
  }
};

// Apply the saved theme on page load
function applyTheme(theme) {
  const html = document.documentElement;
  // Remove all theme classes
  Object.values(themes).forEach(t => html.classList.remove(t.className));
  // Add the chosen theme class
  html.classList.add(themes[theme].className);
}

// Load theme from localStorage or default to light
function loadTheme() {
  const saved = localStorage.getItem(themeKey);
  if (saved && themes[saved]) return saved;
  return 'light';
}

// Save theme to localStorage
function saveTheme(theme) {
  localStorage.setItem(themeKey, theme);
}

// On all pages, apply theme on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const currentTheme = loadTheme();
  applyTheme(currentTheme);

  // If on themes.html, set up event listeners and preview
  if (document.body.id === 'themes-page') {
    setupThemeSelector(currentTheme);
  }
});

function setupThemeSelector(currentTheme) {
  // Populate theme radio buttons or selects with listeners
  const themeRadios = document.querySelectorAll('input[name="theme"]');
  themeRadios.forEach(radio => {
    if (radio.value === currentTheme) radio.checked = true;
    radio.addEventListener('change', e => {
      const selected = e.target.value;
      applyTheme(selected);
    });
  });

  // Save button
  const saveBtn = document.getElementById('save-theme-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const selected = document.querySelector('input[name="theme"]:checked').value;
      saveTheme(selected);
      alert(`Theme saved as ${themes[selected].name}!`);
    });
  }
}
