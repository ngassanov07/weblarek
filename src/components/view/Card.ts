import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { cloneTemplate } from '../../utils/utils';

export class Card extends Component<IProduct> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _text?: HTMLElement;

    protected _onClick?: () => void;

    constructor(container: string | HTMLElement, onClick?: () => void) {
        super(cloneTemplate(container));
        this._onClick = onClick;

        this._title = this.container.querySelector('.card__title')!;
        this._image = this.container.querySelector('.card__image')!;
        this._price = this.container.querySelector('.card__price')!;
        this._category = this.container.querySelector('.card__category');
        this._description = this.container.querySelector('.card__text');
        this._button = this.container.querySelector('.card__button');

        if (this._button) {
            this._button.addEventListener('click', (e) => {
                e.stopPropagation();
                this._onClick?.();
            });
        }

        if (this.container.classList.contains('gallery__item')) {
            this.container.addEventListener('click', () => this._onClick?.());
        }
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set image(value: string) {
        this.setImage(this._image, CDN_URL + value);
    }

    set description(value: string) {
        if (this._description) {
            this._description.textContent = value;
        }
    }

    set price(value: number | null) {
        this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            const modifiers = Object.entries(categoryMap);
            modifiers.forEach(([key, modifier]) => {
                if (key === value) {
                    this._category?.classList.add(modifier);
                } else {
                    this._category?.classList.remove(modifier);
                }
            });
        }
    }

    set button(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }

    set buttonDisabled(value: boolean) {
        if (this._button) {
            this._button.disabled = value;
        }
    }

    render(data: Partial<IProduct>): HTMLElement {
        if (data.title) this.title = data.title;
        if (data.image) this.image = data.image;
        if (data.description) this.description = data.description;
        if (data.price !== undefined) this.price = data.price;
        if (data.category) this.category = data.category;

        return this.container;
    }
}
