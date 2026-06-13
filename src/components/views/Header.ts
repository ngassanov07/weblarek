import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { EVENT_BASKET_OPEN } from '../../utils/events';

type HeaderData = {
    count: number;
};

export class Header extends Component<HeaderData> {
    protected basketButton: HTMLButtonElement;
    protected counterElement: HTMLElement;

    constructor(
        container: HTMLElement,
        protected readonly events: IEvents,
    ) {
        super(container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit(EVENT_BASKET_OPEN);
        });
    }

    render(data?: Partial<HeaderData>): HTMLElement {
        if (data?.count !== undefined) {
            this.counterElement.textContent = String(data.count);
        }
        return this.container;
    }
}
