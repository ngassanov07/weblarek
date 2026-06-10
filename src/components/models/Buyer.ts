import { IBuyer, IBuyerModel, ValidationErrors } from '../../types';
import { EventEmitter } from "../base/Events";

export class Buyer implements IBuyerModel {
    protected data: Partial<IBuyer> = {};
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    setData(data: Partial<IBuyer>): void {
        this.data = {
            ...this.data,
            ...data,
        };
        this.events.emit('buyer:changed');
    }

    getData(): Partial<IBuyer> {
        return { ...this.data };
    }

    clear(): void {
        this.data = {};
        this.events.emit('buyer:changed');
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
