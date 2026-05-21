import { IApi, IOrder, IProduct } from "../../types";

export class LarekApi {
    constructor(protected readonly api: IApi) {}

    getProducts(): Promise<{ total: number; items: IProduct[] }> {
        return this.api.get<{ total: number; items: IProduct[] }>('/product/');
    }
    createOrder(order: IOrder): Promise<{ id: string; total: number }> {
        return this.api.post<{ id: string; total: number }>('/order/', order);
    }
}