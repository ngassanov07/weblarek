import { IProduct, IProducts } from "../../types";
import { EventEmitter } from "../base/Events";

export class Products implements IProducts {
    protected items: IProduct[] = [];
    protected preview: IProduct | null = null;
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    setItems(items: IProduct[]): void {
        this.items = [...items];
        this.events.emit('products:changed');
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }

    setPreview(item: IProduct | null): void {
        this.preview = item;
        this.events.emit('preview:changed');
    }

    getPreview(): IProduct | null {
        return this.preview;
    }
}
