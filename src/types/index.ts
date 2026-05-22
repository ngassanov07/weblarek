export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export type ValidationErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProducts {
    setItems(items: IProduct[]): void;
    getItems(): IProduct[];
    getItem(id: string): IProduct | undefined;
    setPreview(item: IProduct): void;
    getPreview(): IProduct | null;
}

export interface IBasket {
    getItems(): IProduct[];
    addItem(item: IProduct): void;
    removeItem(item: IProduct): void;
    clear(): void;
    getTotal(): number;
    getCount(): number;
    hasItem(id: string): boolean;
}

export interface IBuyerModel {
    setData(data: Partial<IBuyer>): void;
    getData(): Partial<IBuyer>;
    clear(): void;
    validate(): ValidationErrors;
}

export interface IOrder extends IBuyer {
    items: string[];
    total: number;
}

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

export interface IOrderResponse {
    id: string;
    total: number;
}
