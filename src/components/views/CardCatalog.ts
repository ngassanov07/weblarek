import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Card, ICard } from './Card';

export interface ICardCatalog extends ICard {
    category: string;
    image: string;
}

export class CardCatalog extends Card {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(
        container: HTMLElement,
        protected readonly onClick: () => void,
    ) {
        super(container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

        this.container.addEventListener('click', () => {
            this.onClick();
        });
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = 'card__category';
        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) {
            this.categoryElement.classList.add(modifier);
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, value);
    }

    render(data?: Partial<ICardCatalog>): HTMLElement {
        return super.render(data);
    }
}
