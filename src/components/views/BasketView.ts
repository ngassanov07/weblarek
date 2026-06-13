import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { formatPrice } from '../../utils/format';
import { EVENT_ORDER_OPEN } from '../../utils/events';

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    isEmpty: boolean;
}

export class BasketView extends Component<IBasketView> {
    protected listElement: HTMLUListElement;
    protected priceElement: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected readonly events: IEvents,
    ) {
        super(container);
        this.listElement = ensureElement<HTMLUListElement>('.basket__list', container);
        this.priceElement = ensureElement<HTMLElement>('.basket__price', container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.orderButton.addEventListener('click', () => {
            this.events.emit(EVENT_ORDER_OPEN);
        });
    }

    set items(value: HTMLElement[]) {
        this.listElement.replaceChildren(...value);
    }

    set total(value: number) {
        this.priceElement.textContent = formatPrice(value);
    }

    set isEmpty(value: boolean) {
        this.orderButton.disabled = value;
    }
}
