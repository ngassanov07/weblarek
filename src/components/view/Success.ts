import { Component } from "../base/Component";

interface ISuccess {
  total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
  protected _close: HTMLButtonElement;
  protected _total: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this._close = container.querySelector('.order-success__close') as HTMLButtonElement;
    this._total = container.querySelector('.order-success__description') as HTMLElement;

    if (actions?.onClick) {
      this._close?.addEventListener('click', actions.onClick);
    }
  }

  set total(value: number) {
    if (this._total) {
      this._total.textContent = `Списано ${value} синапсов`
    }
  }
}