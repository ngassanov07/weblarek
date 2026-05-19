import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IFormState {
  valid: boolean;
  errors: string;
}

export class Form<T> extends Component<IFormState> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this._submit = container.querySelector('button[type=submit]') as HTMLButtonElement;
    this._errors = container.querySelector('.form__errors') as HTMLElement;

    const formName = container.getAttribute('name') || '';

    container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;

      this.events.emit(`${formName}.${field}:change`, { field, value });
    });

    container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${formName}:submit`);
    });
  }

  set valid(value: boolean) {
    if (this._submit) {
      this._submit.disabled = !value;
    }
  }

  set errors(value: string) {
    if (this._errors) {
      this._errors.textContent = value;
    }
  }

  render(state: Partial<T> & IFormState) {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });
    Object.assign(this, inputs);
    return this.container;
  }
}
