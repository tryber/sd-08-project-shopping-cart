function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  console.log(event.target);
  event.target.remove();
}

function saveStorage() {
  const saveOl = document.querySelector('.cart__items');
  // console.log(saveOl.innerHTML);
  localStorage.setItem('save data', saveOl.innerHTML);
}

function loadStorage() {
  const receiveOl = document.querySelector('.cart__items');
  // console.log(saveOl.innerHTML);
  receiveOl.innerHTML = localStorage.getItem('save data');
  document
    .querySelectorAll('.cart__items')
    .forEach(item => item.addEventListener('click', cartItemClickListener));
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const totalPrice = () => {
  const cartItem = document.querySelectorAll('.cart__item');
  let sum = 0;
  cartItem.forEach(value => {
    const fullItem = value.innerHTML.split('PRICE: $');
    // console.log(fullItem);
    sum += parseFloat(fullItem[1]);
  });
  document.querySelector('.total-price').innerHTML = sum;
  console.log(sum);
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  const createBtn = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  createBtn.addEventListener('click', () => {
    console.log(sku);
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then(value => {
        // console.log(value);
        const { price } = value;
        console.log(price);
        const productObj = { sku, name, salePrice: price };
        document
          .querySelector('.cart__items')
          .appendChild(createCartItemElement(productObj));
        saveStorage();
        totalPrice();
      });
  });
  section.appendChild(createBtn);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const productList = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador').then(
    response => {
      response.json().then(data => {
        data.results.map(value => {
          const dataMl = createProductItemElement({
            sku: value.id,
            name: value.title,
            image: value.thumbnail,
          });
          // console.log(dataMl);
          return document.querySelector('.items').appendChild(dataMl);
        });
      });
    },
  );
};

const emptyCart = document.querySelector('.empty-cart');
emptyCart.addEventListener('click', () => {
  document.querySelector('.cart__items').innerHTML = '';
  saveStorage();
  totalPrice();
  // const deleteLi = document.querySelectorAll('.cart__item');
  // deleteLi.forEach((item) => item.remove());
});

window.onload = function onload() {
  productList();
  loadStorage();
  totalPrice();
};
