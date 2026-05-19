import { Component } from "../base/Component";

interface IBasketView {
  items: HTMLElement[];
  total: number;
}

interface IBasketActions {
  onClick: (event: MouseEvent) => void;
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IBasketActions) {
    super(container);

    this._list = container.querySelector('.basket__list') as HTMLElement;
    this._total = container.querySelector('.basket__price') as HTMLElement;
    this._button = container.querySelector('.basket__button') as HTMLButtonElement;

    if (actions?.onClick && this._button) {
      this._button.addEventListener('click', actions.onClick);
    }

    if (this._button) {
      this._button.disabled = true;
    }

   }

   set items(items: HTMLElement[]) {
    if (items && items.length > 0) {
      this._list.replaceChildren(...items);
      if (this._button) this._button.disabled = false;
    } else {
      const emptyNotice = document.createElement('p');
      emptyNotice.textContent = 'Корзина пуста';
      this._list.replaceChildren(emptyNotice);
      if (this._button) this._button.disabled = true;
    }

   }

   set total(total: number) {
    if (this._total) {
      this._total.textContent = `${total} синапсов`
    }
    
   }

}
