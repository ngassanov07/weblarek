import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { EVENT_MODAL_CLOSE } from '../../utils/events';

type OrderSuccessData = {
    total: number;
};

export class OrderSuccess extends Component<OrderSuccessData> {
    protected descriptionElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected readonly events: IEvents,
    ) {
        super(container);
        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit(EVENT_MODAL_CLOSE);
        });
    }

    render(data?: Partial<OrderSuccessData>): HTMLElement {
        if (data?.total !== undefined) {
            this.descriptionElement.textContent = `Списано ${data.total} синапсов`;
        }
        return this.container;
    }
}
