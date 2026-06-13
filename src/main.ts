import './scss/styles.scss';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { LarekApi } from './components/models/LarekApi';
import { Products } from './components/models/Products';
import { BasketView } from './components/views/BasketView';
import { CardBasket, CardCatalog, CardPreview } from './components/views/Card';
import { Contacts, formatValidationErrors, Order } from './components/views/Form';
import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { OrderSuccess } from './components/views/OrderSuccess';
import { IBuyer, IOrder, ValidationErrors } from './types';
import { API_URL } from './utils/constants';
import {
    EVENT_BASKET_CHANGE,
    EVENT_BASKET_OPEN,
    EVENT_BUYER_CHANGE,
    EVENT_CARD_ADD,
    EVENT_CARD_REMOVE,
    EVENT_CARD_SELECT,
    EVENT_CATALOG_CHANGE,
    EVENT_FORM_CHANGE,
    EVENT_MODAL_CLOSE,
    EVENT_ORDER_NEXT,
    EVENT_ORDER_OPEN,
    EVENT_ORDER_SUBMIT,
    EVENT_PREVIEW_CHANGE,
} from './utils/events';
import { cloneTemplate, ensureElement } from './utils/utils';

type ModalContent = 'preview' | 'basket' | 'order' | 'contacts' | 'success';

const events = new EventEmitter();
const products = new Products(events);
const basket = new Basket(events);
const buyer = new Buyer(events);
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cardPreview = new CardPreview(cloneTemplate('#card-preview'), events);
const basketView = new BasketView(cloneTemplate('#basket'), events);
const orderForm = new Order(cloneTemplate('#order'), events);
const contactsForm = new Contacts(cloneTemplate('#contacts'), events);
const orderSuccess = new OrderSuccess(cloneTemplate('#success'), events);

let currentModalContent: ModalContent | null = null;

function validateOrderStep(data: Partial<IBuyer>): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!data.payment) {
        errors.payment = 'Не выбран вид оплаты';
    }
    if (!data.address?.trim()) {
        errors.address = 'Укажите адрес доставки';
    }

    return errors;
}

function validateContactsStep(data: Partial<IBuyer>): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!data.email?.trim()) {
        errors.email = 'Укажите email';
    }
    if (!data.phone?.trim()) {
        errors.phone = 'Укажите телефон';
    }

    return errors;
}

function renderCatalog(): void {
    const cards = products.getItems().map((item) => {
        const card = new CardCatalog(cloneTemplate<HTMLButtonElement>('#card-catalog'), events);
        card.render({
            id: item.id,
            title: item.title,
            category: item.category,
            image: item.image,
            price: item.price,
        });
        return card.render();
    });
    gallery.render(cards);
}

function renderPreview(): void {
    const preview = products.getPreview();
    if (!preview) {
        return;
    }
    cardPreview.render({
        id: preview.id,
        title: preview.title,
        category: preview.category,
        image: preview.image,
        description: preview.description,
        price: preview.price,
        inBasket: basket.hasItem(preview.id),
    });
}

function renderBasket(): void {
    const items = basket.getItems();
    const cardElements = items.map((item, index) => {
        const card = new CardBasket(cloneTemplate<HTMLLIElement>('#card-basket'), events);
        card.render({
            id: item.id,
            title: item.title,
            price: item.price,
            index: index + 1,
        });
        return card.render();
    });
    basketView.render({
        items: cardElements,
        total: basket.getTotal(),
        isEmpty: items.length === 0,
    });
}

function renderOrderForm(): void {
    const data = buyer.getData();
    const errors = validateOrderStep(data);
    orderForm.render({
        ...data,
        errors: formatValidationErrors(errors),
        valid: Object.keys(errors).length === 0,
    });
}

function renderContactsForm(): void {
    const data = buyer.getData();
    const errors = validateContactsStep(data);
    contactsForm.render({
        ...data,
        errors: formatValidationErrors(errors),
        valid: Object.keys(errors).length === 0,
    });
}

function openPreview(): void {
    currentModalContent = 'preview';
    renderPreview();
    modal.setContent(cardPreview.render());
    modal.open();
}

function openBasket(): void {
    currentModalContent = 'basket';
    renderBasket();
    modal.setContent(basketView.render());
    modal.open();
}

function openOrderForm(): void {
    currentModalContent = 'order';
    renderOrderForm();
    modal.setContent(orderForm.render());
    modal.open();
}

function openContactsForm(): void {
    currentModalContent = 'contacts';
    renderContactsForm();
    modal.setContent(contactsForm.render());
    modal.open();
}

function closeModal(): void {
    modal.close();
    currentModalContent = null;
}

events.on(EVENT_CATALOG_CHANGE, () => {
    renderCatalog();
});

events.on(EVENT_BASKET_CHANGE, () => {
    header.render({ count: basket.getCount() });
    if (currentModalContent === 'basket') {
        renderBasket();
    }
    if (currentModalContent === 'preview') {
        renderPreview();
    }
});

events.on(EVENT_BUYER_CHANGE, () => {
    if (currentModalContent === 'order') {
        renderOrderForm();
    }
    if (currentModalContent === 'contacts') {
        renderContactsForm();
    }
});

events.on(EVENT_PREVIEW_CHANGE, () => {
    if (!products.getPreview()) {
        return;
    }
    if (currentModalContent === 'preview') {
        renderPreview();
    } else {
        openPreview();
    }
});

events.on<{ id: string }>(EVENT_CARD_SELECT, ({ id }) => {
    const item = products.getItem(id);
    if (item) {
        products.setPreview(item);
    }
});

events.on<{ id: string }>(EVENT_CARD_ADD, ({ id }) => {
    const item = products.getItem(id);
    if (item) {
        basket.addItem(item);
    }
    closeModal();
});

events.on<{ id: string }>(EVENT_CARD_REMOVE, ({ id }) => {
    const item = products.getItem(id) ?? basket.getItems().find((product) => product.id === id);
    if (item) {
        basket.removeItem(item);
    }
    if (currentModalContent === 'preview') {
        closeModal();
    }
});

events.on(EVENT_BASKET_OPEN, () => {
    openBasket();
});

events.on(EVENT_ORDER_OPEN, () => {
    openOrderForm();
});

events.on(EVENT_ORDER_NEXT, () => {
    const data = buyer.getData();
    const errors = validateOrderStep(data);
    if (Object.keys(errors).length === 0) {
        openContactsForm();
    }
});

events.on(EVENT_ORDER_SUBMIT, async () => {
    const data = buyer.getData();
    const errors = validateContactsStep(data);
    if (Object.keys(errors).length > 0) {
        return;
    }

    const order: IOrder = {
        payment: data.payment!,
        email: data.email!,
        phone: data.phone!,
        address: data.address!,
        items: basket.getItems().map((item) => item.id),
        total: basket.getTotal(),
    };

    try {
        const response = await larekApi.createOrder(order);
        basket.clear();
        buyer.clear();
        currentModalContent = 'success';
        orderSuccess.render({ total: response.total });
        modal.setContent(orderSuccess.render());
        modal.open();
    } catch {
        contactsForm.render({
            ...data,
            errors: 'Не удалось оформить заказ. Попробуйте ещё раз.',
            valid: false,
        });
        modal.setContent(contactsForm.render());
    }
});

events.on<Partial<IBuyer>>(EVENT_FORM_CHANGE, (data) => {
    buyer.setData(data);
});

events.on(EVENT_MODAL_CLOSE, () => {
    closeModal();
});

header.render({ count: basket.getCount() });

larekApi
    .getProducts()
    .then((response) => {
        products.setItems(response.items);
    })
    .catch(() => {
        // каталог останется пустым при ошибке загрузки
    });
