import { IProduct, IProducts } from "../../types";
import { IEvents } from "../base/Events";
import { EVENT_CATALOG_CHANGE, EVENT_PREVIEW_CHANGE } from "../../utils/events";

export class Products implements IProducts {
    protected items: IProduct[] = [];
    protected preview: IProduct | null = null;

    constructor(protected readonly events: IEvents) {}

    setItems(items: IProduct[]): void {
        this.items = [...items];
        this.events.emit(EVENT_CATALOG_CHANGE);
    }
    getItems(): IProduct[] {
        return this.items;
    }
    getItem(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }
    setPreview(item: IProduct): void {
        this.preview = item;
        this.events.emit(EVENT_PREVIEW_CHANGE);
    }
    getPreview(): IProduct | null {
        return this.preview;
    }
}
