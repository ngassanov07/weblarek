import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { EVENT_MODAL_CLOSE } from '../../utils/events';

export class Modal extends Component<object> {
    protected contentElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        protected readonly events: IEvents,
    ) {
        super(container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit(EVENT_MODAL_CLOSE);
        });

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.events.emit(EVENT_MODAL_CLOSE);
            }
        });
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.contentElement.replaceChildren();
    }

    setContent(content: HTMLElement): void {
        this.contentElement.replaceChildren(content);
    }

    render(): HTMLElement {
        return this.container;
    }
}
