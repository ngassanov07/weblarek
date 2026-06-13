import { IEvents } from '../base/Events';
import { IBuyer } from '../../types';
import { ensureElement } from '../../utils/utils';
import { EVENT_FORM_CHANGE, EVENT_ORDER_SUBMIT } from '../../utils/events';
import { Form, IForm } from './Form';

export interface IContactsForm extends IForm, Partial<IBuyer> {}

export class Contacts extends Form {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        this.emailInput.addEventListener('input', () => {
            this.events.emit(EVENT_FORM_CHANGE, { email: this.emailInput.value });
        });
        this.phoneInput.addEventListener('input', () => {
            this.events.emit(EVENT_FORM_CHANGE, { phone: this.phoneInput.value });
        });
    }

    protected onSubmit(): void {
        this.events.emit(EVENT_ORDER_SUBMIT);
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

    render(data?: Partial<IContactsForm>): HTMLElement {
        return super.render(data);
    }
}
