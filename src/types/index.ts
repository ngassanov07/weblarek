export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'
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

export interface IProducts {
    setItems(item: IProduct[]): void;
    getItems(): IProduct[];
    getItem(id: string): IProduct | undefined;
    setPreview(item: IProduct): void;
    getPreview(): IProduct | null;
}

export interface IBasket {
    getItems(): IProduct[];
    addItem(item: IProduct): void;
    removeItem(itme: IProduct): void;
    clear(): void;
    getTotal(): number;
    getCount(): number;
    hasItem(id: string): boolean;
}

export interface IBuyer {
    setData(data: Partial<Pick<IOrder, 'payment' | 'email' | 'phone' | 'address'>>): void;
    getData(): Partial<Pick<IOrder, 'payment' | 'email' | 'phone' | 'address'>>;
    clear(): void;
    validate(): Partial<Record<'payment' | 'email' | 'phone' | 'address', string>>;
}

export interface IOrder {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    items: string[];
    total: number;
}