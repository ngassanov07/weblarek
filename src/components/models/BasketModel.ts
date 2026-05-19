import { IProduct } from "../../types";

export class BasketModel {
  protected _items: IProduct[] = [];

  getItems(): IProduct[] {
    return this._items;
  }

  add(item: IProduct): void {
    this._items.push(item);
  }

  remove(id: string): void {
    this._items = this._items.filter(item => item.id !== id);
  }

  clear(): void {
    this._items = [];
  }

  getCounter(): number {
    return this._items.length;
  }

  hasItem(id: string): boolean {
    return this._items.some(item => item.id === id);
  }

  getTotalPrice(): number {
    let total = 0;
    for (const item of this._items) {
      if (typeof item.price === 'number') {
        total += item.price;
      }
    }
    return total;
  }
}