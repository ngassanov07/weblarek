import { Component } from '../base/Component';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { formatPrice } from '../../utils/format';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import {
    EVENT_CARD_ADD,
    EVENT_CARD_REMOVE,
    EVENT_CARD_SELECT,
} from '../../utils/events';

export type CardData = {
    title: string;
    price: number | null;
};

export abstract class Card extends Component<CardData> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    }

    protected setPrice(price: number | null): void {
        this.priceElement.textContent = formatPrice(price);
    }

    render(data?: Partial<CardData>): HTMLElement {
        if (data?.title) {
            this.titleElement.textContent = data.title;
        }
        if (data?.price !== undefined) {
            this.setPrice(data.price);
        }
        return this.container;
    }
}

export class CardCatalog extends Card {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(
        container: HTMLElement,
        protected readonly events: IEvents,
    ) {
        super(container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

        this.container.addEventListener('click', () => {
            this.events.emit(EVENT_CARD_SELECT, { id: this.container.dataset.id });
        });
    }

    protected setCategory(category: string): void {
        this.categoryElement.textContent = category;
        this.categoryElement.className = 'card__category';
        const modifier = categoryMap[category as keyof typeof categoryMap];
        if (modifier) {
            this.categoryElement.classList.add(modifier);
        }
    }

    render(data?: Partial<CardData & { id: string; category: string; image: string }>): HTMLElement {
        if (data?.id) {
            this.container.dataset.id = data.id;
        }
        if (data?.category) {
            this.setCategory(data.category);
        }
        if (data?.image) {
            this.setImage(this.imageElement, `${CDN_URL}${data.image}`);
        }
        return super.render(data);
    }
}

export class CardPreview extends Card {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected readonly events: IEvents,
    ) {
        super(container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        this.buttonElement.addEventListener('click', () => {
            if (this.buttonElement.disabled) {
                return;
            }
            const id = this.container.dataset.id;
            if (this.buttonElement.dataset.action === 'remove') {
                this.events.emit(EVENT_CARD_REMOVE, { id });
            } else {
                this.events.emit(EVENT_CARD_ADD, { id });
            }
        });
    }

    protected setCategory(category: string): void {
        this.categoryElement.textContent = category;
        this.categoryElement.className = 'card__category';
        const modifier = categoryMap[category as keyof typeof categoryMap];
        if (modifier) {
            this.categoryElement.classList.add(modifier);
        }
    }

    render(data?: Partial<CardData & {
        id: string;
        category: string;
        image: string;
        description: string;
        inBasket: boolean;
    }>): HTMLElement {
        if (!data) {
            return this.container;
        }
        if (data.id) {
            this.container.dataset.id = data.id;
        }
        if (data.category) {
            this.setCategory(data.category);
        }
        if (data.image) {
            this.setImage(this.imageElement, `${CDN_URL}${data.image}`);
        }
        if (data.description) {
            this.descriptionElement.textContent = data.description;
        }
        if (data.price === null) {
            this.buttonElement.textContent = 'Недоступно';
            this.buttonElement.disabled = true;
            delete this.buttonElement.dataset.action;
        } else if (data.inBasket) {
            this.buttonElement.textContent = 'Удалить из корзины';
            this.buttonElement.disabled = false;
            this.buttonElement.dataset.action = 'remove';
        } else {
            this.buttonElement.textContent = 'Купить';
            this.buttonElement.disabled = false;
            delete this.buttonElement.dataset.action;
        }
        return super.render(data);
    }
}

export class CardBasket extends Card {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected readonly events: IEvents,
    ) {
        super(container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            this.events.emit(EVENT_CARD_REMOVE, { id: this.container.dataset.id });
        });
    }

    render(data?: Partial<CardData & { id: string; index: number }>): HTMLElement {
        if (data?.id) {
            this.container.dataset.id = data.id;
        }
        if (data?.index) {
            this.indexElement.textContent = String(data.index);
        }
        return super.render(data);
    }
}
