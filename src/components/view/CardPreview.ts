import { IProduct } from "../../types";
import { Card } from "./Card";

export interface ICardPreviewData extends IProduct {
  buttonText: string;
  buttonDisabled: boolean;
}

interface ICardPreviewActions {
  onButtonClick: (event: MouseEvent) => void;
}

export class CardPreview extends Card {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardPreviewActions) {
    super(container);

    this._description = container.querySelector('.card__text') as HTMLElement;
    this._button = container.querySelector('.card__button') as HTMLButtonElement;

    if (actions?.onButtonClick && this._button) {
      this._button.addEventListener('click', actions.onButtonClick);
    }
  }

  set description(value: string) {
    if (this._description) {
      this._description.textContent = value;
    }
  }

  set buttonText(value: string) {
    if (this._button) {
      this._button.textContent = value;
    }
  }

  set buttonDisabled(value: boolean) {
    if (this._button) {
      this._button.disabled = value;
    }
  }

  render(data: ICardPreviewData): HTMLElement {
    super.render(data);
    this.description = data.description;
    this.buttonText = data.buttonText;
    this.buttonDisabled = data.buttonDisabled;
    return this.container;
  }
}
