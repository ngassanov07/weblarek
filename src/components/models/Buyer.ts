import { IBuyerData, IBuyerModel, ValidationErrors } from '../../types';
import { IEvents } from '../base/Events';
import { EVENT_BUYER_CHANGE } from '../../utils/events';

const INITIAL_DATA: IBuyerData = {
    payment: null,
    email: '',
    phone: '',
    address: '',
};

export class Buyer implements IBuyerModel {
    protected data: IBuyerData = { ...INITIAL_DATA };

    constructor(protected readonly events: IEvents) {}

    setData(data: Partial<IBuyerData>): void {
        this.data = {
            ...this.data,
            ...data,
        };
        this.events.emit(EVENT_BUYER_CHANGE);
    }

    getData(): IBuyerData {
        return { ...this.data };
    }

    clear(): void {
        this.data = { ...INITIAL_DATA };
        this.events.emit(EVENT_BUYER_CHANGE);
    }

    validate(): ValidationErrors {
        const errors: ValidationErrors = {};

        if (!this.data.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }
        if (!this.data.address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }
        if (!this.data.email.trim()) {
            errors.email = 'Укажите email';
        }
        if (!this.data.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}
