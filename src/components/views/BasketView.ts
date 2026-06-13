import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { formatPrice } from '../../utils/format';
import { EVENT_ORDER_OPEN } from '../../utils/events';

type BasketViewData = {
    items: HTMLElement[];
    total: number;
    isEmpty: boolean;
};

export class BasketView extends Component<BasketViewData> {
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
        this.orderButton.type = 'button';

        this.container.addEventListener('click', (event) => {
            const target = (event.target as HTMLElement).closest('.basket__button');
            if (target && !this.orderButton.disabled) {
                this.events.emit(EVENT_ORDER_OPEN);
            }
        });
    }

    render(data?: Partial<BasketViewData>): HTMLElement {
        if (data?.items) {
            this.listElement.replaceChildren(...data.items);
        }
        if (data?.total !== undefined) {
            this.priceElement.textContent = formatPrice(data.total);
        }
        if (data?.isEmpty !== undefined) {
            this.orderButton.disabled = data.isEmpty;
        }
        return this.container;
    }
}
