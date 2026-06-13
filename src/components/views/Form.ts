import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IBuyer, TPayment, ValidationErrors } from '../../types';
import { ensureElement } from '../../utils/utils';
import {
    EVENT_FORM_CHANGE,
    EVENT_ORDER_NEXT,
    EVENT_ORDER_SUBMIT,
} from '../../utils/events';

export type FormRenderData = {
    errors: string;
    valid: boolean;
};

export abstract class Form extends Component<FormRenderData> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(
        container: HTMLElement,
        protected readonly events: IEvents,
    ) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.onSubmit();
        });
    }

    protected abstract onSubmit(): void;

    protected setErrors(errors: string): void {
        this.errorsElement.textContent = errors;
    }

    protected setSubmitEnabled(enabled: boolean): void {
        this.submitButton.disabled = !enabled;
    }

    render(data?: Partial<FormRenderData>): HTMLElement {
        if (data?.errors !== undefined) {
            this.setErrors(data.errors);
        }
        if (data?.valid !== undefined) {
            this.setSubmitEnabled(data.valid);
        }
        return this.container;
    }
}

export class Order extends Form {
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

    render(data?: Partial<IBuyer & FormRenderData>): HTMLElement {
        if (data?.payment === 'card') {
            this.cardButton.classList.add('button_alt-active');
            this.cashButton.classList.remove('button_alt-active');
        } else if (data?.payment === 'cash') {
            this.cashButton.classList.add('button_alt-active');
            this.cardButton.classList.remove('button_alt-active');
        } else {
            this.cardButton.classList.remove('button_alt-active');
            this.cashButton.classList.remove('button_alt-active');
        }
        if (
            data?.address !== undefined
            && document.activeElement !== this.addressInput
            && this.addressInput.value !== data.address
        ) {
            this.addressInput.value = data.address;
        }
        return super.render(data);
    }
}

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

    render(data?: Partial<IBuyer & FormRenderData>): HTMLElement {
        if (
            data?.email !== undefined
            && document.activeElement !== this.emailInput
            && this.emailInput.value !== data.email
        ) {
            this.emailInput.value = data.email;
        }
        if (
            data?.phone !== undefined
            && document.activeElement !== this.phoneInput
            && this.phoneInput.value !== data.phone
        ) {
            this.phoneInput.value = data.phone;
        }
        return super.render(data);
    }
}

export function formatValidationErrors(errors: ValidationErrors): string {
    return Object.values(errors).join(', ');
}
