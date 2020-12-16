function saveToLocalStorage() {
  localStorage.clear();
  const cartList = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cartList);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  document.querySelector('.cart__items').removeChild(event.target);
  saveToLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchCart() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => {
    response.json().then((data) => {
      const products = data.results;
      products.forEach((element) => {
        const product = { sku: element.id,
          name: element.title,
          image: element.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(product));
      });
    });
  });
}

function addItemToCart() {
  document.querySelector('.items').addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const product = event.target.parentElement;
      const sku = getSkuFromProductItem(product);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then((response) => {
        response.json()
        .then((data) => {
          const productChoosen = {
            sku,
            name: data.title,
            salePrice: data.price,
          };
          document.querySelector('.cart__items').appendChild(createCartItemElement(productChoosen));
          saveToLocalStorage();
        });
      });
    }
  });
}

function getFromLocalStorage() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('cart');
  cartList.addEventListener('click', ((event) => {
    if (event.target.className === 'cart__item') {
      cartItemClickListener(event);
    }
  }));
}

window.onload = function onload() {
  fetchCart();
  addItemToCart();
  getFromLocalStorage();
};
