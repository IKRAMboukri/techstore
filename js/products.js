let products = load('products') || [];

// DOM
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const productId = document.getElementById('productId');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const categorySelect = document.getElementById('productCategory');
const imageInput = document.getElementById('image');
const searchInput = document.getElementById('search');
const preview = document.getElementById('preview');

let imageBase64 = "";

// 📂 Lire image depuis le PC
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    imageBase64 = reader.result;
    preview.src = imageBase64;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);
});

// 🔄 Recharger
function refreshProducts() {
  products = load('products') || [];
}

// 🖥 RENDER
function renderProducts() {
  refreshProducts();
  productList.innerHTML = '';

  const search = searchInput.value.toLowerCase();

  products
    .filter(p => p.name.toLowerCase().includes(search))
    .forEach(p => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>
          <img src="${p.image || 'https://via.placeholder.com/50'}"
               width="50" height="50" style="object-fit:cover;border-radius:6px;">
        </td>
        <td>${p.name}</td>
        <td>${Number(p.price).toFixed(2).replace('.', ',')} DH</td>
        <td>${p.category || '—'}</td>
        <td>
          <button class="btn btn-warning btn-sm btn-edit">Modifier</button>
          <button class="btn btn-danger btn-sm btn-delete">Supprimer</button>
        </td>
      `;

      // ✏️ MODIFIER
      tr.querySelector('.btn-edit').addEventListener('click', () => {
        productId.value = p.id;
        nameInput.value = p.name;
        priceInput.value = p.price;
        categorySelect.value = p.category || '';

        imageBase64 = p.image || "";
        if (p.image) {
          preview.src = p.image;
          preview.style.display = "block";
        } else {
          preview.style.display = "none";
        }
      });

      // 🗑️ SUPPRIMER
      tr.querySelector('.btn-delete').addEventListener('click', () => {
        Swal.fire({
          title: "Supprimer ce produit ?",
          text: "Cette action est irréversible",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Oui, supprimer",
          cancelButtonText: "Annuler"
        }).then((result) => {
          if (result.isConfirmed) {
            products = products.filter(prod => prod.id !== p.id);
            save('products', products);
            renderProducts();
            renderDashboard();

            Swal.fire("Supprimé", "Le produit a été supprimé", "success");
          }
        });
      });

      productList.appendChild(tr);
    });
}

// ➕ AJOUT / ✏️ MODIFICATION
productForm.addEventListener('submit', e => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const price = Number(priceInput.value.replace(',', '.'));
  const category = categorySelect.value;
  const image = imageBase64;

  if (name === '' || price <= 0) {
    Swal.fire("Erreur", "Nom ou prix invalide", "error");
    return;
  }

  refreshProducts();

  // ✏️ MODIFICATION
  if (productId.value) {
    Swal.fire({
      title: "Modifier ce produit ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, modifier",
      cancelButtonText: "Annuler"
    }).then((result) => {
      if (result.isConfirmed) {
        const p = products.find(p => p.id === Number(productId.value));
        if (p) {
          p.name = name;
          p.price = price;
          p.category = category;
          p.image = image;
        }

        save('products', products);
        productForm.reset();
        productId.value = '';
        imageBase64 = "";
        preview.style.display = "none";
        renderProducts();
        renderDashboard();

        Swal.fire("Modifié", "Le produit a été mis à jour", "success");
      }
    });
  }
  // ➕ AJOUT
  else {
    products.push({
      id: Date.now(),
      name,
      price,
      category,
      image
    });

    save('products', products);
    productForm.reset();
    imageBase64 = "";
    preview.style.display = "none";
    renderProducts();
    renderDashboard();

    Swal.fire("Ajouté", "Le produit a été ajouté", "success");
  }
});

// 🔍 Recherche live
searchInput.addEventListener('input', renderProducts);

// ▶ Chargement initial
renderProducts();
