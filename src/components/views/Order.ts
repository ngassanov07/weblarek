import { IEvents } from '../base/Events';
import { TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';
import { EVENT_FORM_CHANGE, EVENT_ORDER_NEXT } from '../../utils/events';
import { Form, IForm } from './Form';

export interface IOrderForm extends IForm {
    payment: TPayment | null;
    address: string;
}

export class Order extends Form<IOrderForm> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this.cardButton.addEventListener('click', () => {
            this.events.emit(EVENT_FORM_CHANGE, { payment: 'card' as TPayment });
        });
        this.cashButton.addEventListener('click', () => {
            this.events.emit(EVENT_FORM_CHANGE, { payment: 'cash' as TPayment });
        });
        this.addressInput.addEventListener('input', () => {
            this.events.emit(EVENT_FORM_CHANGE, { address: this.addressInput.value });
        });
    }

    protected onSubmit(): void {
        this.events.emit(EVENT_ORDER_NEXT);
    }

    set payment(value: TPayment | null) {
        this.cardButton.classList.toggle('button_alt-active', value === 'card');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    render(data?: Partial<IOrderForm>): HTMLElement {
        return super.render(data);
    }
}
