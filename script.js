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

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

const appendObject = (object) => {
  object.forEach((element) => {
    const newObject = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(newObject));
  });
};

const appendInCart = (object) => {
  const cart = document.querySelector('.cart__items');
  const newObject = {
    sku: object.id,
    name: object.title,
    salePrice: object.price,
  };
  cart.appendChild(createCartItemElement(newObject));
};

const fetchToCart = id =>
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then(data => appendInCart(data));

const eventTarget = (event) => {
  if (event.target.classList.contains('item__add')) {
    const parentElement = event.target.parentNode;
    const id = parentElement.firstChild.innerText;
    fetchToCart(id);
  }
};

const addToCart = () => {
  const items = document.querySelector('.items');
  items.addEventListener('click', eventTarget);
};

const buttonEmptyCart = () => {
  const button = document.querySelector('.empty-cart');
  const cart = document.querySelector('.cart__items');
  button.addEventListener('click', () => {
    while (cart.firstChild) {
      cart.removeChild(cart.firstChild);
    }
  });
};

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => appendObject(data.results));
  addToCart();
  buttonEmptyCart();
};
