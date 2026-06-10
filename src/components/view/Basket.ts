import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export interface IBasketEvents {
    'basket:open': void;
    'basket:remove': string;
    'basket:order': void;
}

export class BasketView extends Component<IProduct[]> {
    protected _list: HTMLUListElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _empty?: HTMLElement;
    protected events: EventEmitter;

    constructor(container: string | HTMLElement, events: EventEmitter) {
        super(cloneTemplate(container));
        this.events = events;

        this._list = this.container.querySelector('.basket__list') as HTMLUListElement;
        this._price = this.container.querySelector('.basket__price') as HTMLElement;
        this._button = this.container.querySelector('.basket__button') as HTMLButtonElement;

        this._button.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }

    protected renderEmpty(): void {
        this._list.innerHTML = '<li class="basket__item">Корзина пуста</li>';
        this._button.disabled = true;
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this._button.disabled = false;
        } else {
            this.renderEmpty();
        }
    }

    set price(value: number) {
        this._price.textContent = `${value} синапсов`;
    }

    render(items?: HTMLElement[]): HTMLElement {
        if (!items || items.length === 0) {
            this.renderEmpty();
        } else {
            this.items = items;
        }
        return this.container;
    }
}
