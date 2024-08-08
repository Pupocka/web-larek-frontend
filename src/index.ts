import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { LarekApi } from './components/LarekApi';
import { Order } from './components/OrderDetails/Order';
import { Page } from './components/Page';
import { Product } from './components/Product/Product';
import { ProductPreview } from './components/Product/ProductPreview';
import { ProductsCatalog } from './components/Product/ProductsCatalog';
import './scss/styles.scss';
import { IOrderResult, IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';


const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

events.onAll((event) => {
  console.log(event.eventName, event.data)
})

const productsCatalog = new ProductsCatalog({}, events);


const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const productCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const productBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');



const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events)
const basket = new Basket(cloneTemplate<HTMLTemplateElement>(basketTemplate), events);
const order = new Order(cloneTemplate<HTMLFormElement>(orderTemplate), events);
// const contacts = new Сontacts(cloneTemplate<HTMLFormElement>(contactsTemplate), events);




events.on('items:changed', () => {
  page.catalog = productsCatalog.catalog.map((item) => {
    const card = new Product(cloneTemplate(productCatalogTemplate), {
      onClick: () => events.emit('card:select', item) 
    });
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
    });
  })
})




// Открытие корзины пользователем.








api.getCatalog().then((catalog) => {
  console.log('Каталог товаров:', catalog);
}).catch((error) => {
  console.error('Ошибка при получении каталога:', error);
});







// // // Блокируем прокрутку страницы если открыта модалка
// // emitter.on('modal:open', () => {
// //     page.locked = true;
// // });

// // // Разблокируем прокрутку страницы если открыта модалка
// // emitter.on('modal:close', () => {
// //     page.locked = false;
// // });

