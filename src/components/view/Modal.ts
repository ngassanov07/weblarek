import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export interface IModalEvents {
    open: void;
    close: void;
}

export class Modal extends Component<HTMLElement> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    protected events: EventEmitter;

    constructor(container: string | HTMLElement, events: EventEmitter) {
        super(ensureElement<HTMLElement>(container));
        this.events = events;

        this._closeButton = this.container.querySelector('.modal__close') as HTMLButtonElement;
        this._content = this.container.querySelector('.modal__content') as HTMLElement;

        this._closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
        document.body.style.overflow = 'hidden';
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        document.body.style.overflow = '';
        this.events.emit('modal:close');
    }

    render(data?: HTMLElement): HTMLElement {
        if (data) {
            this.content = data;
        }
        return this.container;
    }
}
