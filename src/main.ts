import './scss/styles.scss';
import { Api } from './components/base/Api';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { LarekApi } from './components/models/LarekApi';
import { Products } from './components/models/Products';
import { EventEmitter } from './components/base/Events';
import { IProduct, IBuyer, ValidationErrors } from './types';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';
import { ensureElement } from './utils/utils';

// View components
import { Gallery } from './components/view/Gallery';
import { Card } from './components/view/Card';
import { Modal } from './components/view/Modal';
import { BasketView } from './components/view/Basket';
import { BasketItem } from './components/view/BasketItem';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { Header } from './components/view/Header';

// Models
const products = new Products();
const basket = new Basket();
const buyer = new Buyer();

// API
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

// Events
const events = new EventEmitter();

// View
const gallery = new Gallery();
const modal = new Modal('#modal-container', events);
const header = new Header('.header', events);
const basketView = new BasketView('#basket', events);
const orderForm = new OrderForm('#order', events);
const contactsForm = new ContactsForm('#contacts', events);
const successModal = new Success('#success', events);

// State
let currentStep: 'order' | 'contacts' = 'order';

// Presenter logic

// Load products
larekApi
    .getProducts()
    .then((response) => {
        products.setItems(response.items);
    })
    .catch((error: unknown) => {
        console.error('Error loading products:', error);
    });

// Update gallery when products change
events.on('products:changed', () => {
    const items = products.getItems().map(
        (product) =>
            new Card('#card-catalog', () => {
                products.setPreview(product);
                events.emit('preview:changed');
            }).render(product)
    );
    gallery.render(items);
});

// Show product preview
events.on('preview:changed', () => {
    const product = products.getPreview();
    if (product) {
        const card = new Card('#card-preview', () => {
            if (basket.hasItem(product.id)) {
                basket.removeItem(product);
            } else {
                basket.addItem(product);
            }
            modal.close();
        });

        // Update button text
        const isInBasket = basket.hasItem(product.id);
        if (product.price === null) {
            card.buttonDisabled = true;
            card.button = 'Недоступно';
        } else if (isInBasket) {
            card.button = 'Удалить из корзины';
        } else {
            card.button = 'В корзину';
        }

        modal.render(card.render(product));
        modal.open();
    }
});

// Update basket when items change
events.on('basket:changed', () => {
    header.render({ counter: basket.getCount() });
});

// Open basket modal
events.on('basket:open', () => {
    const items = basket.getItems().map((product, index) => {
        const item = new BasketItem('#card-basket', events, product.id, index + 1);
        return item.render(product);
    });

    basketView.render(items);
    basketView.price = basket.getTotal();
    modal.render(basketView.render(items));
    modal.open();
});

// Remove item from basket
events.on<{ id: string }>('basket:remove', ({ id }) => {
    const product = products.getItem(id);
    if (product) {
        basket.removeItem(product);
    }
});

// Open checkout
events.on('basket:order', () => {
    currentStep = 'order';
    modal.render(orderForm.render());
    modal.open();
});

// Handle form changes
events.on<{ field: string; value: string; form: string }>(
    'form:change',
    ({ field, value, form }) => {
        if (form === 'order') {
            buyer.setData({ [field]: value } as Partial<IBuyer>);
        } else if (form === 'contacts') {
            buyer.setData({ [field]: value } as Partial<IBuyer>);
        }

        const errors = buyer.validate();
        if (form === 'order') {
            orderForm.errors = errors as ValidationErrors;
            orderForm.submitDisabled = !!(errors.address || errors.payment);
        } else if (form === 'contacts') {
            contactsForm.errors = errors as ValidationErrors;
            contactsForm.submitDisabled = !!(errors.email || errors.phone);
        }
    }
);

// Handle form submission
events.on<{ form: string }>('form:submit', ({ form }) => {
    if (form === 'order') {
        currentStep = 'contacts';
        modal.render(contactsForm.render());
    } else if (form === 'contacts') {
        const data = buyer.getData();
        const order = {
            ...data,
            items: basket.getItems().map((p) => p.id),
            total: basket.getTotal(),
        };

        larekApi
            .createOrder(order as any)
            .then(() => {
                const success = new Success('#success', events);
                modal.render(success.render({ total: basket.getTotal() }));
                basket.clear();
                buyer.clear();
            })
            .catch((error: unknown) => {
                console.error('Error creating order:', error);
            });
    }
});

// Close success modal
events.on('success:close', () => {
    modal.close();
    header.render({ counter: basket.getCount() });
});

// Modal close event
events.on('modal:close', () => {
    products.setPreview(null);
    currentStep = 'order';
});

// Initial render
products.setItems(apiProducts.items);
header.render({ counter: 0 });
