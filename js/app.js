function showSection(id) {
  document.querySelectorAll('.app-section')
    .forEach(s => s.classList.add('d-none'));

  document.getElementById(id).classList.remove('d-none');

  if (id === 'dashboard') renderDashboard();
}

// 👉 mlli t7ell site, bayna dashboard
document.addEventListener('DOMContentLoaded', () => {
  showSection('dashboard');
});
