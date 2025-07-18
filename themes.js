// themes.js

const themes = {
  'light': 'theme-light',
  'neon-blue': 'theme-neon-blue',
  'dark-red': 'theme-dark-red'
};

function applyTheme(themeKey) {
  const themeClass = themes[themeKey] || 'theme-light';
  document.documentElement.className = themeClass;
  localStorage.setItem('selectedTheme', themeKey);
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem('selectedTheme') || 'light';
  applyTheme(savedTheme);
}

document.addEventListener('DOMContentLoaded', () => {
  loadSavedTheme();

  const selector = document.getElementById('themeSelector');
  const saveButton = document.getElementById('saveTheme');

  if (selector && saveButton) {
    selector.value = localStorage.getItem('selectedTheme') || 'light';

    selector.addEventListener('change', () => {
      applyTheme(selector.value);
    });

    saveButton.addEventListener('click', () => {
      alert(`Theme saved: ${selector.value}`);
    });
  }
});
