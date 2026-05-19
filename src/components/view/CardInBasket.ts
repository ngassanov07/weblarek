import { Card } from "./Card";

interface ICardInBasketActions {
  onDelete: (event: MouseEvent) => void;
}

export class CardInBasket extends Card {
  protected _index: HTMLElement;
  protected _buttonDelete: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardInBasketActions) {
    super(container);

    this._index = container.querySelector('.basket__item-index') as HTMLElement;
    this._buttonDelete = container.querySelector('.basket__item-delete') as HTMLButtonElement;

    if (actions?.onDelete && this._buttonDelete) {
      this._buttonDelete.addEventListener('click', actions.onDelete);
    }
  }

  set index(value: number) {
    if (this._index) {
      this._index.textContent = value.toString();
    }
  }
}