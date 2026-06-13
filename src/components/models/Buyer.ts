import { IBuyer, IBuyerModel, ValidationErrors } from '../../types';
import { IEvents } from '../base/Events';
import { EVENT_BUYER_CHANGE } from '../../utils/events';

export class Buyer implements IBuyerModel {
    protected data: Partial<IBuyer> = {};

    constructor(protected readonly events: IEvents) {}

    setData(data: Partial<IBuyer>): void {
        this.data = {
            ...this.data,
            ...data,
        };
        this.events.emit(EVENT_BUYER_CHANGE, { data: this.getData() });
    }
    getData(): Partial<IBuyer> {
        return { ...this.data };
    }
    clear(): void {
        this.data = {};
        this.events.emit(EVENT_BUYER_CHANGE, { data: this.getData() });
    }

    validate(): ValidationErrors {
        const errors: ValidationErrors = {};

        if (!this.data.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }
        if (!this.data.address?.trim()) {
            errors.address = 'Укажите адрес доставки';
        }
        if (!this.data.email?.trim()) {
            errors.email = 'Укажите email';
        }
        if (!this.data.phone?.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}
