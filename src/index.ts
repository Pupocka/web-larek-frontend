import { ProductsCatalog } from './components/products/ProductsCatalog';
import { Product } from './components/products/Product';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { LarekApi } from './components/LarekApi';
import { Order } from './components/orderDetails/Order';
import { Contacts } from './components/orderDetails/Contacts';
import { Page } from './components/Page';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrder, IOrderForm, IProduct } from './types';
import { Success } from './components/common/Success';

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
const contacts = new Contacts(cloneTemplate<HTMLFormElement>(contactsTemplate), events);


events.on('products:changed', () => {
  page.catalog = productsCatalog.catalog.map((item) => {
    const product = new Product('card', cloneTemplate(productCatalogTemplate), {
      onClick: () => events.emit('product:preview', item) 
    });
    return product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
    });
  })
})

events.on('product:preview', (item: IProduct) => {
	const product = new Product('card', cloneTemplate(productPreviewTemplate),  {
		onClick: () => events.emit('basket:add-product', item),
	});
	modal.render({
		content: product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
			description: item.description,
		}),
	});

	if (item.price === null) {
		product.setDisabled(product.button, true);
	} else if (productsCatalog.containsProduct(item)) {
		product.setDisabled(product.button, true);
	}
});

events.on('basket:add-product', (item: IProduct) => {
	productsCatalog.addItem('addOrderID', item);
	productsCatalog.addItem('addToBasket', item);
	page.counter = productsCatalog.basket.length;
	modal.close();
});

function updateBasketUI(productsCatalog: ProductsCatalog) {
	basket.total = productsCatalog.getTotalOrder();
	basket.setDisabled(basket.button, productsCatalog.isBasketEmpty);
	basket.items = productsCatalog.basket.map((item, index) => {
			const product = new Product('card', cloneTemplate(productBasket), {
					onClick: () => events.emit('basket:remove-product', item),
			});
			return product.render({
					title: item.title,
					price: item.price,
					index: index + 1,
			});
	});

	modal.render({
			content: basket.render(),
	});
}

events.on('basket:open', () => {
	updateBasketUI(productsCatalog);
});

events.on('basket:remove-product', (item: IProduct) => {
	productsCatalog.removeItem('basket', item);
	productsCatalog.removeItem('order', item);
	page.counter = productsCatalog.basket.length;
	updateBasketUI(productsCatalog);
});

events.on('basket:create-order', () => {
	modal.render({
			content: order.render({
					address: '',
					payment: '',
					valid: false,
					errors: [],
			}),
	});
});

events.on('order:submit', () => {
	productsCatalog.order.total = productsCatalog.getTotalOrder();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;
	order.valid = !address && !payment;
	contacts.valid = !email && !phone;
	order.errors = Object.values({ address, payment }).filter(i => !!i).join('; ');
	contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

events.on('order:set-payment-type', (item: HTMLButtonElement) => {
	productsCatalog.order.payment = item.name;
	productsCatalog.validateForm();
});

events.on(
	/^order\..*:change/, (data: { field: keyof IOrderForm; value: string }) => {
		productsCatalog.setOrderField(data.field, data.value);
		
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		productsCatalog.setOrderField(data.field, data.value);
	}
);

events.on('order:submit', () => {
	api.order(productsCatalog.order)
		.then((res) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					total: res.total,
				}),
			});

			productsCatalog.clearBasket();
			page.counter = 0;
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

api.getCatalog()
  .then(productsCatalog.setCatalog.bind(productsCatalog))
  .catch((error) => {
    console.error('Ошибка при получении каталога:', error);
  });