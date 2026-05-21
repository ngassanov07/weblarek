import { IBuyer, IOrder } from '../../types';

export class Buyer implements IBuyer {
    protected data: Partial<Pick<IOrder, 'payment' | 'email' | 'phone' | 'address'>> = {};

    setData(data: Partial<Pick<IOrder, 'payment' | 'email' | 'phone' | 'address'>>): void {
        this.data = {
            ...this.data,
            ...data,
        };
    }
    getData(): Partial<Pick<IOrder, 'payment' | 'email' | 'phone' | 'address'>> {
        return { ...this.data };
    }
    clear(): void {
        this.data = {};
    }
    validate(): Partial<Record<'payment' | 'email' | 'phone' | 'address', string>> {
        const errors: Partial<Record<'payment' | 'email' | 'phone' | 'address', string>> = {};

        if (!this.data.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }
        if (!this.data.email) {
            errors.payment = 'Укажите адрес доставки';
        }
        if (!this.data.phone) {
            errors.payment = 'Укажите email';
        }
        if (!this.data.address) {
            errors.payment = 'Укажите телефон';
        }

        return errors;
    }
}