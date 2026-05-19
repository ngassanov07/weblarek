import { Api } from './base/Api';
import { IProduct, IOrder } from '../types/index';

export interface ApiListResponse<Type> {
  total: number;
  items: Type[];
}

export interface ILarekApi {
  getProductList: () => Promise<IProduct[]>;
  orderProducts: (order: IOrder) => Promise<IOrder & { id: string }>;
}

export class LarekApi extends Api implements ILarekApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getProductList(): Promise<IProduct[]> {
  return this.get<ApiListResponse<IProduct>>('/product')
    .then((data) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
      }))
    );
}

  orderProducts(order: IOrder): Promise<IOrder & { id: string }> {
    return this.post<IOrder & { id: string }>('/order', order)
      .then((data) => data);
  }
}