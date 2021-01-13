
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchAndFormateProducts() {
  try {
    const data = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const { results } = await data.json();
    results.forEach((product) => {
      const createObjectItem = createProductItemElement(product);
      document.querySelector('.items').appendChild(createObjectItem);
    });
  } catch (error) {
    console.log('Deu erro', error);
  }
}

function addElementToShoppingCart() {
  const allItens = document.querySelector('.items');
  allItens.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const clickedElementParent = event.target.parentElement;
      const IdfromParent = getSkuFromProductItem(clickedElementParent);
      fetch(`https://api.mercadolibre.com/items/${IdfromParent}`)
      .then(results => results.json())
      .then((data) => {
        const addItem = { sku: data.id, name: data.title, salePrice: data.price};
        const createdElementInCart = createCartItemElement(addItem);
        document.querySelector('.cart__items').appendChild(createdElementInCart);
      })
    }
  })
}
window.onload = function onload() {
  fetchAndFormateProducts();
  addElementToShoppingCart();
};
