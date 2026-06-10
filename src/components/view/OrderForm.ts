import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';
import { TPayment } from '../../types';

export class OrderForm extends Form {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;

    constructor(container: string | HTMLElement, events: EventEmitter) {
        super(container, events);

        this._paymentButtons = Array.from(
            this.container.querySelectorAll('button[type="button"]')
        ) as HTMLButtonElement[];
        this._addressInput = this.container.querySelector('input[name="address"]')!;

        this._paymentButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.setPayment(button.name as TPayment);
                this.onInputChange('payment', button.name);
            });
        });

        this._addressInput.addEventListener('input', (e) => {
            this.onInputChange('address', (e.target as HTMLInputElement).value);
        });
    }

    protected setPayment(value: TPayment): void {
        this._paymentButtons.forEach((button) => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    set payment(value: TPayment) {
        this.setPayment(value);
    }
}
