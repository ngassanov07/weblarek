import './scss/styles.scss';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { LarekApi } from './components/models/LarekApi';
import { Products } from './components/models/Products';
import { BasketView } from './components/views/BasketView';
import { CardBasket } from './components/views/CardBasket';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { Contacts } from './components/views/Contacts';
import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { Order } from './components/views/Order';
import { OrderSuccess } from './components/views/OrderSuccess';
import { IBuyer, IOrder, ValidationErrors } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import {
    EVENT_BASKET_CHANGE,
    EVENT_BASKET_OPEN,
    EVENT_BUYER_CHANGE,
    EVENT_CATALOG_CHANGE,
    EVENT_FORM_CHANGE,
    EVENT_MODAL_CLOSE,
    EVENT_ORDER_NEXT,
    EVENT_ORDER_OPEN,
    EVENT_ORDER_SUBMIT,
    EVENT_PREVIEW_CHANGE,
} from './utils/events';
import { formatValidationErrors } from './utils/format';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const products = new Products(events);
const basket = new Basket(events);
const buyer = new Buyer(events);
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketView = new BasketView(cloneTemplate('#basket'), events);
const orderForm = new Order(cloneTemplate('#order'), events);
const contactsForm = new Contacts(cloneTemplate('#contacts'), events);
const orderSuccess = new OrderSuccess(cloneTemplate('#success'), events);

const cardPreview = new CardPreview(cloneTemplate('#card-preview'), () => {
    const preview = products.getPreview();
    if (!preview || preview.price === null) {
        return;
    }
    if (basket.hasItem(preview.id)) {
        basket.removeItem(preview);
    } else {
        basket.addItem(preview);
    }
    closeModal();
});

function pickStepErrors(
    errors: ValidationErrors,
    fields: Array<keyof IBuyer>,
): ValidationErrors {
    const stepErrors: ValidationErrors = {};
    for (const field of fields) {
        if (errors[field]) {
            stepErrors[field] = errors[field];
        }
    }
    return stepErrors;
}

function isStepValid(errors: ValidationErrors): boolean {
    return Object.keys(errors).length === 0;
}

function getPreviewButtonText(price: number | null, inBasket: boolean): string {
    if (price === null) {
        return 'Недоступно';
    }
    if (inBasket) {
        return 'Удалить из корзины';
    }
    return 'Купить';
}

function renderCatalog(): void {
    const cards = products.getItems().map((item) => {
        const card = new CardCatalog(
            cloneTemplate<HTMLButtonElement>('#card-catalog'),
            () => products.setPreview(item),
        );
        card.render({
            title: item.title,
            category: item.category,
            image: `${CDN_URL}${item.image}`,
            price: item.price,
        });
        return card.render();
    });
    gallery.render({ catalog: cards });
}

function renderPreview(): void {
    const preview = products.getPreview();
    if (!preview) {
        return;
    }
    const inBasket = basket.hasItem(preview.id);
    cardPreview.render({
        title: preview.title,
        category: preview.category,
        image: `${CDN_URL}${preview.image}`,
        description: preview.description,
        price: preview.price,
        buttonText: getPreviewButtonText(preview.price, inBasket),
        buttonDisabled: preview.price === null,
    });
}

function renderBasket(): void {
    const items = basket.getItems();
    const cardElements = items.map((item, index) => {
        const card = new CardBasket(
            cloneTemplate<HTMLLIElement>('#card-basket'),
            () => basket.removeItem(item),
        );
        card.render({
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
    const errors = pickStepErrors(buyer.validate(), ['payment', 'address']);
    orderForm.render({
        payment: data.payment,
        address: data.address ?? '',
        errors: formatValidationErrors(errors),
        valid: isStepValid(errors),
    });
}

function renderContactsForm(): void {
    const data = buyer.getData();
    const errors = pickStepErrors(buyer.validate(), ['email', 'phone']);
    contactsForm.render({
        email: data.email ?? '',
        phone: data.phone ?? '',
        errors: formatValidationErrors(errors),
        valid: isStepValid(errors),
    });
}

function openPreview(): void {
    modal.setContent(cardPreview.render());
    modal.open();
}

function openBasket(): void {
    modal.setContent(basketView.render());
    modal.open();
}

function openOrderForm(): void {
    modal.setContent(orderForm.render());
    modal.open();
}

function openContactsForm(): void {
    modal.setContent(contactsForm.render());
    modal.open();
}

function closeModal(): void {
    modal.close();
}

events.on(EVENT_CATALOG_CHANGE, () => {
    renderCatalog();
});

events.on(EVENT_BASKET_CHANGE, () => {
    header.render({ count: basket.getCount() });
    renderBasket();
    renderPreview();
});

events.on(EVENT_BUYER_CHANGE, () => {
    renderOrderForm();
    renderContactsForm();
});

events.on(EVENT_PREVIEW_CHANGE, () => {
    renderPreview();
    if (products.getPreview()) {
        openPreview();
    }
});

events.on(EVENT_BASKET_OPEN, () => {
    openBasket();
});

events.on(EVENT_ORDER_OPEN, () => {
    openOrderForm();
});

events.on(EVENT_ORDER_NEXT, () => {
    openContactsForm();
});

events.on(EVENT_ORDER_SUBMIT, async () => {
    const buyerData = buyer.getValidatedData();
    if (!buyerData) {
        return;
    }

    const order: IOrder = {
        ...buyerData,
        items: basket.getItems().map((item) => item.id),
        total: basket.getTotal(),
    };

    try {
        const response = await larekApi.createOrder(order);
        basket.clear();
        buyer.clear();
        orderSuccess.render({ total: response.total });
        modal.setContent(orderSuccess.render());
        modal.open();
    } catch (error) {
        console.error(error);
        const data = buyer.getData();
        contactsForm.render({
            email: data.email ?? '',
            phone: data.phone ?? '',
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

basket.clear();
buyer.clear();

larekApi
    .getProducts()
    .then((response) => {
        products.setItems(response.items);
    })
    .catch((error: unknown) => {
        console.error(error);
    });
