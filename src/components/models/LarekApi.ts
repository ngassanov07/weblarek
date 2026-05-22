import { IApi, IOrder, IOrderResponse, IProductsResponse } from '../../types';

export class LarekApi {
    constructor(protected readonly api: IApi) {}

    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product/');
    }
    createOrder(order: IOrder): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', order);
    }
}
