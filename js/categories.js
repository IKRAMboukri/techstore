let categories = load('categories') || [];

const categoryList = document.getElementById('categoryList');
const categoryId = document.getElementById('categoryId');
const categoryName = document.getElementById('categoryName');

// Ajout du CSS pour les bouttons professionnels
const style = document.createElement('style');
style.textContent = `
  .category-actions {
    display: flex;
    gap: 6px;
  }
  
  .btn-action {
    width: 34px;
    height: 34px;
    border: 1px solid;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    font-size: 14px;
    background: white;
    padding: 0;
  }
  
  .btn-edit {
    border-color: #2c80ff;
    color: #2c80ff;
    background: #f0f7ff;
  }
  
  .btn-edit:hover {
    background: #2c80ff;
    color: white;
    border-color: #2c80ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(44, 128, 255, 0.2);
  }
  
  .btn-delete {
    border-color: #ff4757;
    color: #ff4757;
    background: #fff5f5;
  }
  
  .btn-delete:hover {
    background: #ff4757;
    color: white;
    border-color: #ff4757;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(255, 71, 87, 0.2);
  }
  
  .list-group-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    margin-bottom: 8px;
    background: white;
    transition: all 0.2s ease;
  }
  
  .list-group-item:hover {
    border-color: #d0d0d0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .category-name {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }
  
  /* Style pour le formulaire */
  .form-control:focus {
    border-color: #2c80ff;
    box-shadow: 0 0 0 0.2rem rgba(44, 128, 255, 0.1);
  }
  
  .btn-primary {
    background: #2c80ff;
    border-color: #2c80ff;
  }
  
  .btn-primary:hover {
    background: #1a6fe8;
    border-color: #1a6fe8;
  }
`;
document.head.appendChild(style);

// Charger les catégories depuis l'API si localStorage vide
if (categories.length === 0) {
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
      const apiCategories = [...new Set(data.map(p => p.category))].map((name, index) => ({
        id: index + 1,
        name
      }));

      categories = apiCategories;
      save('categories', categories);
      renderCategories();
      renderCategoryOptions();
    })
    .catch(err => console.error('API categories error', err));
}

// RENDER LISTE
function renderCategories() {
  categoryList.innerHTML = '';
  categories.forEach(c => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `
      <span class="category-name">${c.name}</span>
      <div class="category-actions">
        <button class="btn-action btn-edit" title="Modifier">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5 1.5L14.5 4.5L5.5 13.5H2.5V10.5L11.5 1.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="btn-action btn-delete" title="Supprimer">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4H14M5.5 4V3C5.5 2.44772 5.94772 2 6.5 2H9.5C10.0523 2 10.5 2.44772 10.5 3V4M12.5 4V13C12.5 13.5523 12.0523 14 11.5 14H4.5C3.94772 14 3.5 13.5523 3.5 13V4H12.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    `;

    // Modifier
    li.querySelector('.btn-edit').addEventListener('click', () => {
      categoryId.value = c.id;
      categoryName.value = c.name;
      categoryName.focus();
    });

    // Supprimer avec SweetAlert2
    li.querySelector('.btn-delete').addEventListener('click', () => {
      Swal.fire({
        title: "Supprimer cette catégorie ?",
        html: `Vous êtes sur le point de supprimer la catégorie <strong>"${c.name}"</strong>. Cette action est irréversible.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler",
        backdrop: `
          rgba(0,0,0,0.5)
          url("https://sweetalert2.github.io/images/nyan-cat.gif")
          left top
          no-repeat
        `
      }).then((result) => {
        if (result.isConfirmed) {
          // Animation de suppression
          li.style.opacity = '0.5';
          li.style.transform = 'translateX(20px)';
          li.style.transition = 'all 0.3s ease';
          
          setTimeout(() => {
            categories = categories.filter(cat => cat.id !== c.id);
            save('categories', categories);
            renderCategories();
            renderCategoryOptions();
            
            Swal.fire({
              title: "Supprimée !",
              text: `La catégorie "${c.name}" a été supprimée.`,
              icon: "success",
              timer: 2000,
              showConfirmButton: false
            });
          }, 300);
        }
      });
    });

    categoryList.appendChild(li);
  });
}

// AJOUT / MODIFICATION
function saveCategory() {
  const name = categoryName.value.trim();
  if (name === '') {
    Swal.fire({
      icon: "error",
      title: "Champ vide",
      text: "Veuillez saisir un nom de catégorie",
      timer: 2000,
      showConfirmButton: false
    });
    
    // Animation d'erreur
    categoryName.style.borderColor = '#ff4757';
    categoryName.style.boxShadow = '0 0 0 3px rgba(255, 71, 87, 0.1)';
    setTimeout(() => {
      categoryName.style.borderColor = '';
      categoryName.style.boxShadow = '';
    }, 1000);
    return;
  }

  // MODIFICATION
  if (categoryId.value) {
    const categoryToModify = categories.find(c => c.id === Number(categoryId.value));
    if (categoryToModify) {
      const oldName = categoryToModify.name;
      
      // Si le nom n'a pas changé
      if (oldName === name) {
        Swal.fire({
          icon: "info",
          title: "Aucun changement",
          text: "Le nom de la catégorie n'a pas changé",
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }
      
      // Vérifier les doublons
      const nameExists = categories.some(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== categoryToModify.id);
      if (nameExists) {
        Swal.fire({
          icon: "error",
          title: "Doublon détecté",
          text: `La catégorie "${name}" existe déjà`,
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }
      
      // Confirmation de modification
      Swal.fire({
        title: "Modifier cette catégorie ?",
        html: `Voulez-vous modifier <strong>"${oldName}"</strong> en <strong>"${name}"</strong> ?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, modifier",
        cancelButtonText: "Annuler"
      }).then((result) => {
        if (result.isConfirmed) {
          categoryToModify.name = name;
          save('categories', categories);
          categoryId.value = '';
          categoryName.value = '';
          renderCategories();
          renderCategoryOptions();
          
          Swal.fire({
            title: "Modifiée !",
            html: `La catégorie a été modifiée<br><strong>${oldName} → ${name}</strong>`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });
        }
      });
    }
  } 
  // AJOUT
  else {
    // Vérifier les doublons
    const nameExists = categories.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (nameExists) {
      Swal.fire({
        icon: "error",
        title: "Doublon détecté",
        text: `La catégorie "${name}" existe déjà`,
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }
    
    // Confirmation d'ajout
    Swal.fire({
      title: "Ajouter cette catégorie ?",
      html: `Voulez-vous ajouter la catégorie <strong>"${name}"</strong> ?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Oui, ajouter",
      cancelButtonText: "Annuler",
      input: "text",
      inputLabel: "Note optionnelle",
      inputPlaceholder: "Ajoutez une note si nécessaire...",
      inputAttributes: {
        maxlength: "100"
      },
      showLoaderOnConfirm: true,
      preConfirm: (note) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (note === "erreur") {
              Swal.showValidationMessage("Note invalide (test)");
            }
            resolve();
          }, 1000);
        });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        categories.push({
          id: Date.now(),
          name
        });
        
        save('categories', categories);
        categoryName.value = '';
        renderCategories();
        renderCategoryOptions();
        
        Swal.fire({
          title: "Ajoutée !",
          html: `La catégorie <strong>"${name}"</strong> a été ajoutée avec succès`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
}

// REMPLIR LE SELECT PRODUIT
function renderCategoryOptions() {
  const select = document.getElementById('productCategory');
  select.innerHTML = '<option value="">-- Choisir catégorie --</option>';
  categories.forEach(c => {
    const option = document.createElement('option');
    option.value = c.name; 
    option.textContent = c.name;
    select.appendChild(option);
  });
}

// Initial render
renderCategories();
renderCategoryOptions();