// themes.js - handles theme switching and persistence

const themeForm = document.getElementById('themeForm');
const themeRadios = document.querySelectorAll('input[name="theme"]');
const themePreview = document.getElementById('themePreview');

function applyTheme(theme) {
  document.body.classList.remove('theme-light', 'theme-neon-blue', 'theme-dark-neon-red');
  if (theme === 'neon-blue') {
    document.body.classList.add('theme-neon-blue');
  } else if (theme === 'dark-neon-red') {
    document.body.classList.add('theme-dark-neon-red');
  } else {
    document.body.classList.add('theme-light');
  }
}

function updatePreview(theme) {
  applyTheme(theme);
  themePreview.style.backgroundColor = '';
  themePreview.style.color = '';

  if (theme === 'neon-blue') {
    themePreview.style.backgroundColor = '#003f5c';
    themePreview.style.color = '#00d8ff';
  } else if (theme === 'dark-neon-red') {
    themePreview.style.backgroundColor = '#4a0000';
    themePreview.style.color = '#ff073a';
  } else {
    themePreview.style.backgroundColor = '#fff';
    themePreview.style.color = '#000';
  }
}

function loadTheme() {
  let savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
  themeRadios.forEach(radio => {
    radio.checked = radio.value === savedTheme;
  });
  updatePreview(savedTheme);
}

themeForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
  localStorage.setItem('theme', selectedTheme);
  applyTheme(selectedTheme);
  updatePreview(selectedTheme);
  alert(`Theme "${selectedTheme}" saved!`);
});

// live preview on radio change
themeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    updatePreview(radio.value);
  });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadTheme);
