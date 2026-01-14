// app.js
let currentSection = 'dashboard';

function showSection(id) {
  document.querySelectorAll('.app-section')
    .forEach(s => s.classList.add('d-none'));

  document.getElementById(id).classList.remove('d-none');
  currentSection = id;

  if (id === 'dashboard') {
    renderDashboard();
  } else if (id === 'products') {
    renderProducts();
  } else if (id === 'categories') {
    renderCategories();
    renderCategoryOptions();
  }
}

// 👉 mlli t7ell site, bayna dashboard
document.addEventListener('DOMContentLoaded', () => {
  showSection('dashboard');
});