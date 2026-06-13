import { IBasket, IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { EVENT_BASKET_CHANGE } from "../../utils/events";

export class Basket implements IBasket {
    protected items: IProduct[] = [];

    constructor(protected readonly events: IEvents) {}

    getItems(): IProduct[] {
        return this.items;
    }
    addItem(item: IProduct): void {
        if (!this.hasItem(item.id)) {
            this.items.push(item);
            this.events.emit(EVENT_BASKET_CHANGE, { items: this.items });
        }
    }
    removeItem(item: IProduct): void {
        this.items = this.items.filter((basketItem) => basketItem.id !== item.id);
        this.events.emit(EVENT_BASKET_CHANGE, { items: this.items });
    }
    clear(): void {
        this.items = [];
        this.events.emit(EVENT_BASKET_CHANGE, { items: this.items });
    }
    getTotal(): number {
        return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
    }
    getCount(): number {
        return this.items.length;
    }
    hasItem(id: string): boolean {
        return this.items.some((item) => item.id === id);
    }
}