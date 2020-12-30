
function saveLocalStorage() {
  const cart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cart);
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
  const parentElement = event.target.parentElement;
  parentElement.removeChild(event.target);
  saveLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createItemsList() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const items = document.querySelector('.items');
  fetch(url)
    .then(response => response.json())
    .then(data => data.results.forEach((item) => {
      const obj = {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      };
      items.appendChild(createProductItemElement(obj));
    }));
}

function addItemCart() {
  const items = document.querySelector('.items');
  items.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const parentElement = event.target.parentNode;
      const itemID = getSkuFromProductItem(parentElement);
      fetch(`https://api.mercadolibre.com/items/${itemID}`)
        .then(response => response.json())
        .then((data) => {
          const item = {
            sku: data.id,
            name: data.title,
            salePrice: data.price,
          };
          const cartItems = document.querySelector('.cart__items');
          cartItems.appendChild(createCartItemElement(item));
          saveLocalStorage();
        });
    }
  });
}

function loadCart() {
  const localStorageCart = localStorage.getItem('cart');
  document.querySelector('.cart__items').innerHTML = localStorageCart;
}

window.onload = function onload() {
  createItemsList();
  addItemCart();
  loadCart();
};
