import { Component } from '../base/Component';
import { cloneTemplate } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export class Success extends Component<{ total: number }> {
    protected _close: HTMLButtonElement;
    protected _description: HTMLElement;
    protected events: EventEmitter;

    constructor(container: string | HTMLElement, events: EventEmitter) {
        super(cloneTemplate(container));
        this.events = events;

        this._close = this.container.querySelector('.order-success__close')!;
        this._description = this.container.querySelector('.order-success__description')!;

        this._close.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        this._description.textContent = `Списано ${value} синапсов`;
    }

    render(data?: { total: number }): HTMLElement {
        if (data) {
            this.total = data.total;
        }
        return this.container;
    }
}
