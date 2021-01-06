// function createProductImageElement(imageSource) {
//   const img = document.createElement('img');
//   img.className = 'item__image';
//   img.src = imageSource;
//   return img;
// }

// function createCustomElement(element, className, innerText) {
//   const e = document.createElement(element);
//   e.className = className;
//   e.innerText = innerText;
//   return e;
// }

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui

// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

function gerarLista() {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  createLoading();
  fetch(API_URL)
    .then(response => response.json())
    .then((data) => {
      removeLoading();
      data.results.forEach((item) => {
        const obj = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        document.getElementsByClassName('items')[0].appendChild(createProductItemElement(obj));
      });
    });
}

window.onload = function onload() {
  gerarLista();
};
