import { Form } from "./Form";
import { IEvents } from "../base/Events";

interface IContactForm {
  email: string;
  phone: string;
}

export class Contacts extends Form<IContactForm> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  set email(value: string) {
    const input = this.container.querySelector('input[name=email]') as HTMLInputElement;
    if (input) {
      input.value = value;
    }
  }

  set phone(value: string) {
    const input = this.container.querySelector('input[name=phone]') as HTMLInputElement;
    if (input) {
      input.value = value;
    }
  }
}