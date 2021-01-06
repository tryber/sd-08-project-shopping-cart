window.onload = function onload() { };

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
function saveCartItems() {
  const stCart = document.querySelector('.cart__items');
  localStorage.setItem('stCart', stCart.innerHTML);
}

async function pricesSum() {
  const allPrices = [];
  document.querySelectorAll('.cart__item').forEach(element => allPrices.push(Number(element.innerHTML.split('$')[1])));
  totalPrices = allPrices.reduce((acc, price) => acc + price, 0);
  document.querySelector('.total-price').innerHTML = totalPrices;
}
function loadingTxt() {
  document.body.removeChild(document.body.firstElementChild);
}
function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
  saveCartItems();
  pricesSum();
}
function cartItem() {
  const shopCartItems = document.querySelector('.cart__items');
  shopCartItems.innerHTML = localStorage.getItem('stCart');
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function loadingTxt() {
  document.body.removeChild(document.body.firstElementChild);
}
function clearCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    saveCartItems();
    pricesSum();
  });
}

function createList() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
  .then(response => response.json())// transforme o resultaod e json
  .then((object) => {
    const { results } = object;
    const sectionItens = document.querySelector('.items');
    results.forEach((product) => {
      const obj = { sku: product.id, name: product.title, image: product.thumbnail };
      sectionItens.appendChild(createProductItemElement(obj));
    });
  });
}
function addItemToCart() {
  const selectItems = document.querySelector('.items');
  selectItems.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const parentElem = event.target.parentElement;
      const idProduct = getSkuFromProductItem(parentElem);
      fetch(`https://api.mercadolibre.com/items/${idProduct}`)
        .then(response => response.json())
        .then((resp) => {
          const objResult = {
            sku: resp.id,
            name: resp.title,
            salePrice: resp.price,
          };
          document.querySelector('.cart__items')
          .appendChild(createCartItemElement(objResult));
          saveCartItems();
          pricesSum();
        });
    }
  });
}
window.onload = function onload() {
  addItemToCart();
  createList();
  cartItem();
  clearCart();
};
