fetch('https://fakestoreapi.com/products')
  .then(res => res.json())
  .then(data => {

    const apiProducts = data.map(p => ({
  id: p.id,
  name: p.title,
  price: p.price,
  category: p.category,
  image: p.image  
}));


    const apiCategories = [...new Set(data.map(p => p.category))].map((name, i) => ({
      id: i + 1,
      name
    }));

    if (load('products').length === 0) {
      save('products', apiProducts);
    }

    if (load('categories').length === 0) {
      save('categories', apiCategories);
    }


    if (typeof renderProducts === "function") renderProducts();
    if (typeof renderCategories === "function") renderCategories();
    if (typeof renderCategoryOptions === "function") renderCategoryOptions();
    if (typeof renderDashboard === "function") renderDashboard();
  })
  .catch(err => console.error(err));
