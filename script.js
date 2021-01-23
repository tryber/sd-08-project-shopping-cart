function totalPrice() {
  let total = 0;
  document.querySelectorAll('.cart__item').forEach(item => {
    total += parseFloat(item.innerText.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = total;
}
const addLocalStorage = () => {
  const completedList = document.querySelector('.cart__items');
  localStorage.setItem('eachItem', completedList.innerHTML);
};
function cartItemClickListener(mariola) {
  mariola.target.remove();
  totalPrice();
  addLocalStorage();
}
const getLocalStorage = () => {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem(
    'eachItem',
  );
  document.querySelectorAll('.cart__item').forEach(item => item.addEventListener('click', cartItemClickListener));
  totalPrice();
};
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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
  const botaoComprar = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  botaoComprar.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(result => result.json())
      .then(data => {
        const { id, title, price } = data;
        const elementoCarrinho = createCartItemElement({
          sku: id,
          name: title,
          salePrice: price,
        });
        document.querySelector('.cart__items').appendChild(elementoCarrinho);
        totalPrice();
        addLocalStorage();
      });
  });
  section.appendChild(botaoComprar);
  return section;
}

const listagem = async () => {
  const itemsList = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(result => result.json())
    .then(data => data.results);
  const itemsContainer = document.querySelector('.items');
  itemsContainer.innerHTML = '';
  itemsList.forEach(computador => {
    const { id, title, thumbnail } = computador;
    const elemento = createProductItemElement({
      sku: id,
      name: title,
      image: thumbnail,
    });
    itemsContainer.appendChild(elemento);
  });
};

document.querySelector('.empty-cart').addEventListener('click', () => {
  document.querySelector('.cart__items').innerHTML = '';
  totalPrice();
  addLocalStorage();
});

window.onload = function onload() {
  listagem();
  getLocalStorage();
};
