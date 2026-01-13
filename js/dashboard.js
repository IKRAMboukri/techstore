
// let chart = null;

// function renderDashboard() {

//   // 📦 données
//   const products = load('products') || [];
//   const categories = load('categories') || [];

//   // 🧹 produits valides
//   const validProducts = products.filter(
//     p => p && p.name && p.price
//   );

//   // 🔢 KPIs
//   const totalProducts = validProducts.length;

//   const totalPrice = validProducts.reduce(
//     (sum, p) => sum + Number(p.price),
//     0
//   );

//   const totalCategories = categories.length;

//   // 🧾 CARDS DASHBOARD
//   document.getElementById('kpi-container').innerHTML = `
//     <div class="col-md-4">
//       <div class="card p-3 shadow-sm">
//         <h6>Total des produits</h6>
//         <h2>${totalProducts}</h2>
//       </div>
//     </div>

//     <div class="col-md-4">
//       <div class="card p-3 shadow-sm">
//         <h6>Prix total</h6>
//         <h2>${totalPrice.toFixed(2).replace('.', ',')} DH</h2>
//       </div>
//     </div>

//     <div class="col-md-4">
//       <div class="card p-3 shadow-sm">
//         <h6>Total des catégories</h6>
//         <h2>${totalCategories}</h2>
//       </div>
//     </div>
//   `;

//   // 📊 CHART : prix par produit
//   const labels = validProducts.map(p => p.name);
//   const prices = validProducts.map(p => p.price);

//   const ctx = document.getElementById('productsChart');

//   if (chart) chart.destroy();

//   chart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels,
//       datasets: [{
//         label: 'Prix (DH)',
//         data: prices,
//         backgroundColor: '#0d6efd'
//       }]
//     }
//   });
// }
let chart = null;
let categoryChart = null;

function renderDashboard() {
  // 📦 données
  const products = load('products') || [];
  const categories = load('categories') || [];

  // 🧹 produits valides
  const validProducts = products.filter(
    p => p && p.name && p.price
  );

  // 🔢 KPIs
  const totalProducts = validProducts.length;

  const totalPrice = validProducts.reduce(
    (sum, p) => sum + Number(p.price),
    0
  );

  const totalCategories = categories.length;
  
  // Prix moyen
  const averagePrice = totalProducts > 0 ? (totalPrice / totalProducts).toFixed(2) : 0;

  // Catégorie la plus populaire
  const categoryCounts = {};
  validProducts.forEach(p => {
    if (p.category && p.category.trim() !== "") {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    } else {
      categoryCounts["Non catégorisé"] = (categoryCounts["Non catégorisé"] || 0) + 1;
    }
  });
  
  const mostPopularCategory = Object.keys(categoryCounts).length > 0 
    ? Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b)
    : "Aucune";

  // 🧾 CARDS DASHBOARD MODERNES
  document.getElementById('kpi-container').innerHTML = `
    <div class="col-md-3">
      <div class="dashboard-card card-product">
        <div class="card-icon">
          <i class="fas fa-box"></i>
        </div>
        <div class="card-content">
          <h6 class="card-label">Produits</h6>
          <h2 class="card-value">${totalProducts}</h2>
          <small class="card-trend">${validProducts.length > 0 ? '+0% cette semaine' : 'Aucun produit'}</small>
        </div>
      </div>
    </div>

    <div class="col-md-3">
      <div class="dashboard-card card-revenue">
        <div class="card-icon">
          <i class="fas fa-money-bill-wave"></i>
        </div>
        <div class="card-content">
          <h6 class="card-label">Valeur totale</h6>
          <h2 class="card-value">${totalPrice.toFixed(2).replace('.', ',')} DH</h2>
          <small class="card-trend">${averagePrice} DH moyenne</small>
        </div>
      </div>
    </div>

    <div class="col-md-3">
      <div class="dashboard-card card-category">
        <div class="card-icon">
          <i class="fas fa-tags"></i>
        </div>
        <div class="card-content">
          <h6 class="card-label">Catégories</h6>
          <h2 class="card-value">${totalCategories}</h2>
          <small class="card-trend">${mostPopularCategory}</small>
        </div>
      </div>
    </div>

    <div class="col-md-3">
      <div class="dashboard-card card-stats">
        <div class="card-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="card-content">
          <h6 class="card-label">Performance</h6>
          <h2 class="card-value">${validProducts.length}</h2>
          <small class="card-trend">Produits actifs</small>
        </div>
      </div>
    </div>
  `;

  // 📊 CHART : prix par produit
  const labels = validProducts.slice(0, 10).map(p => 
    p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name
  );
  const prices = validProducts.slice(0, 10).map(p => p.price);

  // Statistiques par catégorie pour le graphique circulaire
  const categoryData = Object.entries(categoryCounts);
  const categoryLabels = categoryData.map(([name]) => name);
  const categoryCountsArray = categoryData.map(([_, count]) => count);

  const ctx = document.getElementById('productsChart');
  const ctx2 = document.getElementById('categoryChart');

  // Détruire les anciens graphiques
  if (chart) chart.destroy();
  if (categoryChart) categoryChart.destroy();

  // Graphique 1: Bar chart des produits
  if (validProducts.length > 0) {
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Prix (DH)',
          data: prices,
          backgroundColor: '#667eea',
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 12,
            cornerRadius: 6,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return `${context.parsed.y} DH`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: function(value) {
                return value + ' DH';
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              maxRotation: 45
            }
          }
        }
      }
    });
  } else {
    ctx.parentElement.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-chart-bar fa-3x text-muted mb-3"></i>
        <p class="text-muted">Aucun produit à afficher</p>
      </div>
    `;
  }

  // Graphique 2: Pie chart des catégories
  if (categoryData.length > 0) {
    categoryChart = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: categoryLabels,
        datasets: [{
          data: categoryCountsArray,
          backgroundColor: [
            '#667eea', '#764ba2', '#f093fb', '#f5576c',
            '#4fd1c5', '#38b2ac', '#ed8936', '#ecc94b',
            '#9f7aea', '#805ad5'
          ],
          borderWidth: 0,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} produit${value > 1 ? 's' : ''} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  } else {
    ctx2.parentElement.innerHTML = `
      <div class="text-center py-5">
        <i class="fas fa-tags fa-3x text-muted mb-3"></i>
        <p class="text-muted">Aucune catégorie à afficher</p>
      </div>
    `;
  }

  // Récents produits
  const recentProducts = validProducts.slice(-5).reverse();
  const recentProductsHTML = recentProducts.map(p => `
    <div class="recent-product">
      <div class="product-image">
        <img src="${p.image || 'https://via.placeholder.com/40'}" 
             alt="${p.name}" 
             onerror="this.src='https://via.placeholder.com/40'">
      </div>
      <div class="product-info">
        <h6 class="product-name">${p.name}</h6>
        <small class="product-category">${p.category || 'Non catégorisé'}</small>
      </div>
      <div class="product-price">
        <strong>${Number(p.price).toFixed(2).replace('.', ',')} DH</strong>
      </div>
    </div>
  `).join('');

  document.getElementById('recent-products').innerHTML = recentProductsHTML || 
    '<div class="text-center py-4"><i class="fas fa-box-open fa-2x text-muted mb-3"></i><p class="text-muted">Aucun produit récent</p></div>';

  // Statistiques rapides
  const statsHTML = `
    <div class="stat-item">
      <div class="stat-icon">
        <i class="fas fa-box-open"></i>
      </div>
      <div class="stat-content">
        <h6>Produits sans catégorie</h6>
        <p class="stat-value">${categoryCounts["Non catégorisé"] || 0}</p>
      </div>
    </div>
    
    <div class="stat-item">
      <div class="stat-icon">
        <i class="fas fa-money-bill"></i>
      </div>
      <div class="stat-content">
        <h6>Produit le plus cher</h6>
        <p class="stat-value">${validProducts.length > 0 ? Math.max(...validProducts.map(p => p.price)).toFixed(2) : '0.00'} DH</p>
      </div>
    </div>
    
    <div class="stat-item">
      <div class="stat-icon">
        <i class="fas fa-money-bill-wave"></i>
      </div>
      <div class="stat-content">
        <h6>Produit le moins cher</h6>
        <p class="stat-value">${validProducts.length > 0 ? Math.min(...validProducts.map(p => p.price)).toFixed(2) : '0.00'} DH</p>
      </div>
    </div>
    
    <div class="stat-item">
      <div class="stat-icon">
        <i class="fas fa-percentage"></i>
      </div>
      <div class="stat-content">
        <h6>Catégories utilisées</h6>
        <p class="stat-value">${Object.keys(categoryCounts).length} / ${totalCategories}</p>
      </div>
    </div>
  `;
  
  document.getElementById('quick-stats').innerHTML = statsHTML;
}

// Ajoutez ce CSS pour les statistiques rapides
const statsStyle = document.createElement('style');
statsStyle.textContent = `
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .stat-item {
    background: #f8fafc;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s ease;
    border: 1px solid #e2e8f0;
  }
  
  .stat-item:hover {
    background: white;
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    flex-shrink: 0;
  }
  
  .stat-content {
    flex: 1;
    min-width: 0;
  }
  
  .stat-content h6 {
    color: #718096;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .stat-value {
    color: #2d3748;
    font-weight: 700;
    font-size: 18px;
    margin: 0;
    line-height: 1;
  }
  
  @media (max-width: 1200px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(statsStyle);