import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export class Form extends Component<HTMLFormElement> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;
    protected events: EventEmitter;

    constructor(container: string | HTMLElement, events: EventEmitter) {
        super(ensureElement<HTMLFormElement>(container));
        this.events = events;

        this._submit = this.container.querySelector('button[type="submit"]')!;
        this._errors = this.container.querySelector('.form__errors')!;

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit(`form:submit`, { form: this.container.name });
        });
    }

    protected onInputChange(field: string, value: string): void {
        this.events.emit(`form:change`, { field, value, form: this.container.name });
    }

    set errors(value: Record<string, string>) {
        const errorMessages = Object.entries(value)
            .filter(([, message]) => !!message)
            .map(([, message]) => message);
        this._errors.textContent = errorMessages.join('; ');
    }

    set submit(text: string) {
        this._submit.textContent = text;
    }

    set submitDisabled(value: boolean) {
        this._submit.disabled = value;
    }

    render(data?: any): HTMLElement {
        return this.container;
    }
}
