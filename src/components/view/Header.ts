import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export class Header extends Component<{ counter: number }> {
    protected _counter: HTMLElement;
    protected _basket: HTMLButtonElement;
    protected events: EventEmitter;

    constructor(container: string | HTMLElement, events: EventEmitter) {
        super(ensureElement<HTMLElement>(container));
        this.events = events;

        this._basket = this.container.querySelector('.header__basket')!;
        this._counter = this.container.querySelector('.header__basket-counter')!;

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this._counter.textContent = String(value);
    }

    render(data?: { counter: number }): HTMLElement {
        if (data) {
            this.counter = data.counter;
        }
        return this.container;
    }
}
