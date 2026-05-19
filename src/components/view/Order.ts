import { Form } from "./Form";
import { IEvents } from "../base/Events";

interface IOrderForm {
  address: string;
  payment: string;
}

export class Order extends Form<IOrderForm> {
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._cardButton = container.querySelector('button[name="card"]') as HTMLButtonElement;
    this._cashButton = container.querySelector('button[name="cash"]') as HTMLButtonElement;

    this._cardButton?.addEventListener('click', () => {
      this.payment = 'card';
      this.events.emit('order.payment:change', { target: 'card' });
    });

    this._cashButton?.addEventListener('click', () => {
      this.payment = 'cash';
      this.events.emit('order.payment:change', { target: 'cash' });
    });
  }

  set payment(value: string) {
    this._cardButton?.classList.toggle('button_alt-active', value === 'card');
    this._cashButton?.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    const input = this.container.querySelector('input[name=address]') as HTMLInputElement;
    if (input) {
      input.value = value;
    }
  }
}
