import './scss/styles.scss';

import { LarekApi } from './components/LarekApi';
import { EventEmitter } from './components/base/Events';
import { BasketModel } from './components/models/BasketModel';
import { ProductModel } from './components/models/ProductModel';
import { UserModel } from './components/models/UserModel';
import { Basket } from './components/view/Basket';
import { Card } from './components/view/Card';
import { CardInBasket } from './components/view/CardInBasket';
import { CardPreview } from './components/view/CardPreview';
import { Contacts } from './components/view/Contacts';
import { Modal } from './components/view/Modal';
import { Order } from './components/view/Order';
import { Page } from './components/view/Page';
import { Success } from './components/view/Success';
import { CDN_URL, API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IOrder, TPayment } from './types';

const events = new EventEmitter();

const api = new LarekApi(CDN_URL, API_URL);
const productModel = new ProductModel();
const basketModel = new BasketModel();
const userModel = new UserModel();

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basketView = new Basket(cloneTemplate<HTMLElement>('#basket'), {
	onClick: () => {
		modal.render({ content: renderOrderStep() });
	},
});

const orderView = new Order(cloneTemplate<HTMLFormElement>('#order'), events);
const contactsView = new Contacts(cloneTemplate<HTMLFormElement>('#contacts'), events);

const successView = new Success(cloneTemplate<HTMLElement>('#success'), {
	onClick: () => modal.close(),
});

// --- Render helpers ---

const renderCatalogCard = (item: IProduct) => {
	const card = new Card(cloneTemplate<HTMLButtonElement>('#card-catalog'), {
		onClick: () => events.emit('card:select', item),
	});
	return card.render(item);
};

const renderPreviewCard = (item: IProduct) => {
	const card = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'), {
		onButtonClick: () => events.emit('basket:add', item),
	});
	return card.render({
		...item,
		buttonDisabled: item.price === null || basketModel.hasItem(item.id),
		buttonText: basketModel.hasItem(item.id) ? 'Уже в корзине' : 'В корзину',
	});
};

const renderBasketCard = (item: IProduct, index: number) => {
	const card = new CardInBasket(cloneTemplate<HTMLLIElement>('#card-basket'), {
		onDelete: () => events.emit('basket:remove', item),
	});
	return card.render({ ...item, index: index + 1 } as IProduct & { index: number });
};

const renderOrderStep = () => {
	const errors = userModel.validateOrderStep();
	const userData = userModel.getUserData();
	return orderView.render({
		address: userData.address,
		payment: userData.payment,
		valid: errors.length === 0,
		errors: errors.join('; '),
	});
};

const renderContactsStep = () => {
	const errors = userModel.validateContactsStep();
	const userData = userModel.getUserData();
	return contactsView.render({
		email: userData.email,
		phone: userData.phone,
		valid: errors.length === 0,
		errors: errors.join('; '),
	});
};

const updateBasket = () => {
	page.counter = basketModel.getCounter();
	basketView.items = basketModel.getItems().map(renderBasketCard);
	basketView.total = basketModel.getTotalPrice();
};

const handleError = (error: unknown) => String(error);

// --- Events ---

events.on('card:select', (item: IProduct) => {
	productModel.setPreview(item);
	modal.render({ content: renderPreviewCard(item) });
});

events.on('basket:open', () => {
	updateBasket();
	modal.render({ content: basketView.render() });
});

events.on('basket:add', (item: IProduct) => {
	if (!basketModel.hasItem(item.id)) {
		basketModel.add(item);
		updateBasket();

		const preview = productModel.getPreview();
		if (preview) {
			modal.render({ content: renderPreviewCard(preview) });
		}
	}
});

events.on('basket:remove', (item: IProduct) => {
	basketModel.remove(item.id);
	updateBasket();
	modal.render({ content: basketView.render() });
});

events.on('order.address:change', ({ value }: { value: string }) => {
	userModel.setUserData({ address: value });
	renderOrderStep();
});

events.on('order.payment:change', ({ target }: { target: TPayment }) => {
	userModel.setUserData({ payment: target });
	renderOrderStep();
});

events.on('contacts.email:change', ({ value }: { value: string }) => {
	userModel.setUserData({ email: value });
	renderContactsStep();
});

events.on('contacts.phone:change', ({ value }: { value: string }) => {
	userModel.setUserData({ phone: value });
	renderContactsStep();
});

events.on('order:submit', () => {
	modal.render({ content: renderContactsStep() });
});

events.on('contacts:submit', () => {
	const order: IOrder = {
		...userModel.getUserData(),
		total: basketModel.getTotalPrice(),
		items: basketModel.getItems().map((item) => item.id),
	};

	api.orderProducts(order)
		.then(() => {
			const total = basketModel.getTotalPrice();
			basketModel.clear();
			userModel.clear();
			productModel.clearPreview();
			updateBasket();
			modal.render({ content: successView.render({ total }) });
		})
		.catch((error: unknown) => {
			contactsView.errors = handleError(error);
		});
});

events.on('modal:open', () => { page.locked = true; });
events.on('modal:close', () => { page.locked = false; });

api.getProductList()
	.then((items) => {
		productModel.setItems(items);
		page.catalog = items.map(renderCatalogCard);
		updateBasket();
	})
	.catch((error: unknown) => {
		console.error(handleError(error));
	});
