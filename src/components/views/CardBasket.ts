import { ensureElement } from '../../utils/utils';
import { Card, ICard } from './Card';

export interface ICardBasket extends ICard {
    index: number;
}

export class CardBasket extends Card {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected readonly onDelete: () => void,
    ) {
        super(container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            this.onDelete();
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

    render(data?: Partial<ICardBasket>): HTMLElement {
        return super.render(data);
    }
}
