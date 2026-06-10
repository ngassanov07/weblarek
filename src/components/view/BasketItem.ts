import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export class BasketItem extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _index: HTMLElement;
    protected events: EventEmitter;
    protected _id: string;

    constructor(container: string | HTMLElement, events: EventEmitter, id: string, index: number) {
        super(cloneTemplate(container));
        this.events = events;
        this._id = id;

        this._title = this.container.querySelector('.card__title')!;
        this._price = this.container.querySelector('.card__price')!;
        this._index = this.container.querySelector('.basket__item-index')!;
        this._button = this.container.querySelector('.basket__item-delete')!;

        this._index.textContent = String(index);
        this._button.addEventListener('click', () => {
            this.events.emit('basket:remove', { id: this._id });
        });
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number) {
        this._price.textContent = `${value} синапсов`;
    }

    render(data: Partial<IProduct>): HTMLElement {
        if (data.title) this.title = data.title;
        if (data.price) this.price = data.price;
        return this.container;
    }
}
