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
  // coloque seu código aqui!!!!
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function findItems(category = 'computador') {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${category}`)
    .then(resposta => resposta.json())
    .then(dados => dados.results)
    .then(results => results.forEach(({ id, title, thumbnail }) => {
      const item = {
        sku: id,
        name: title,
        image: thumbnail,
      };
      const sectionItems = document.querySelector('.items');
      sectionItems.appendChild(createProductItemElement(item));
    }));
    btnAddEvent();
}

function btnAddEvent() {
  const sectionItems = document.querySelector('.items');
  sectionItems.addEventListener('click', (event) => {
    // console.log(event.target.className);
    if (event.target.className === 'item__add') {
      // console.log('ok');
      const parent = event.target.parentElement;
      console.log(parent.className);
      
      
    }
  });

  // const btnItemAdd = document.querySelectorAll('.item__add');
  // console.log(btnItemAdd);
  // btnItemAdd.forEach()
}


window.onload = function onload() {
  findItems();
  
}
