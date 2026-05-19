import { Component } from "../base/Component";
import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _categoryClass = '';

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = container.querySelector('.card__title') as HTMLElement;
    this._image = container.querySelector('.card__image') as HTMLImageElement; 
    this._category = container.querySelector('.card__category') as HTMLElement;
    this._price = container.querySelector('.card__price') as HTMLElement;

    if (actions?.onClick) {
      container.addEventListener('click', actions.onClick);
    }
  }

  set title(value: string) {
    if (this._title) this._title.textContent = value;
  }

  get title(): string {
    return this._title?.textContent || '';
  }
  
  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;

      if (this._categoryClass) {
        this._category.classList.remove(this._categoryClass);
      }

      this._categoryClass = categoryMap[value as keyof typeof categoryMap] || '';
      if (this._categoryClass) {
        this._category.classList.add(this._categoryClass);
      }
    }
  }

  set price(value: number | null) {
    if (this._price) {
      this._price.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
    }
  }
}
