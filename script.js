async function totalValue() {
  const cartValue = await document.querySelectorAll('.cart__item');
  let initialPrice = 0;
  await cartValue.forEach((product) => {
    const value = parseFloat(product.innnerHTML.split('$')[1]);
    initialPrice = value + initialPrice;
    return Math.round(initialPrice.toFixed(2));
  });
  const valueTotal = document.querySelector('.total-price');
  valueTotal.innerHTML = initialPrice;
}

function endLoading() {
  const pageLoading = document.querySelector('.loading');
  pageLoading.remove();
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

function savingLocalStorage() {
  localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
}
  
function cartItemClickListener(event) {
  event.stopPropagation();
  event.currentTarget.remove('');
  totalValue();
  savingLocalStorage();
}

function removeItem() {
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach(element => element.addEventListener('click', cartItemClickListener));
}

function gettingLocalStorage() {
  const cart = localStorage.getItem('cart');
  document.querySelector('.cart__items').innnerHTML = cart;
  totalValue();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createListOfProducts() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((object) => {
    endLoading();
    object.results.forEach((element) => {
      const item = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      };
      document.querySelector('.items').appendChild(createProductItemElement(item));
    });
  });
}

function addProduct() {
  document.querySelector('.items').addEventListener('click', (Event) => {
    if (Event.target.classList.contains('item__add')) {
      const sku = getSkuFromProductItem(Event.target.parentNode);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then((data) => {
        const item = {
          sku,
          name: data.title,
          salePrice: data.price,
        };
        document.querySelector('.cart__items').appendChild(createCartItemElement(item));
        totalValue();
        savingLocalStorage();
      });
    }
  });
}

function clearButton() {
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', () => {
    document.querySelector('cart__items').innerHTML = '';
    const totalPrice = document.querySelector('.total-price');
    totalPrice.innerHTML = 0;
    savingLocalStorage();
  });
}

window.onload = function onload() {
  gettingLocalStorage();
  createListOfProducts();
  addProduct();
  clearButton();
};
