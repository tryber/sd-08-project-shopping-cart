function calcPrice() {
  let total = 0;
  document.querySelectorAll('.cart__item').forEach(item => {
    total += parseFloat(item.innerText.split('$')[1]);
    console.log(total);
  });
  document.querySelector('.total-price').innerHTML = total;
}

function addToLocalStorage() {
  localStorage.setItem('key', document.querySelector('.cart__items').innerHTML);
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  calcPrice();
  addToLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addProductToCart(event) {
  try {
    const itemId = event.target.parentNode.firstChild.innerText;
    const response = await fetch(
      `https://api.mercadolibre.com/items/${itemId}`,
    );
    const item = await response.json();
    const liItem = createCartItemElement(item);
    document.querySelector('.cart__items').appendChild(liItem);
    calcPrice();
    addToLocalStorage();
  } catch (error) {
    console.log('falha no carregamento', error);
  }
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  button.addEventListener('click', addProductToCart);
  section.appendChild(button);
  document.querySelector('.loading').innerText = '';
  return section;
}

async function fetchProducts() {
  try {
    const response = await fetch(
      'https://api.mercadolibre.com/sites/MLB/search?q=computador',
    );
    const { results } = await response.json();
    results.forEach(product => {
      const productItem = createProductItemElement(product);
      document.querySelector('.items').appendChild(productItem);
    });
  } catch (error) {
    console.log('falha no carregamento', error);
  }
}

document.querySelector('.empty-cart').addEventListener('click', () => {
  document.querySelector('.cart__items').innerHTML = '';
  calcPrice();
  addToLocalStorage();
});

function getFromLocalStorage() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem(
    'key',
  );
  document.querySelectorAll('.cart__item').forEach(item => {
    item.addEventListener('click', cartItemClickListener);
  });
  calcPrice();
}

window.onload = function onload() {
  document.querySelector('.loading').innerText = 'loading...';
  fetchProducts();
  getFromLocalStorage();
};
