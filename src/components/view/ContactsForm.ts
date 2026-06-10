import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export class ContactsForm extends Form {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: string | HTMLElement, events: EventEmitter) {
        super(container, events);

        this._emailInput = this.container.querySelector('input[name="email"]')!;
        this._phoneInput = this.container.querySelector('input[name="phone"]')!;

        this._emailInput.addEventListener('input', (e) => {
            this.onInputChange('email', (e.target as HTMLInputElement).value);
        });

        this._phoneInput.addEventListener('input', (e) => {
            this.onInputChange('phone', (e.target as HTMLInputElement).value);
        });
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }
}
