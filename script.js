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
  event.target.remove();
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
  section
    .appendChild(
      createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
    )
    .addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then(resolve => resolve.json())
        .then(data => {
          const cartItem = {
            sku,
            name,
            salePrice: data.price,
          };
          document
            .querySelector('.cart__items')
            .appendChild(createCartItemElement(cartItem));
        });
    });

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

const getApiList = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(resolve => resolve.json())
    .then(data => {
      data.results.forEach(product => {
        const productList = {
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        };
        document
          .querySelector('.items')
          .appendChild(createProductItemElement(productList));
      });
    });
};

window.onload = function onload() {
  getApiList();
};
