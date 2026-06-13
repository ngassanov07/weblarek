import { ValidationErrors } from '../types';

export function formatPrice(price: number | null): string {
    if (price === null) {
        return 'Бесценно';
    }
    return `${price} синапсов`;
}

export function formatValidationErrors(errors: ValidationErrors): string {
    return Object.values(errors).join(', ');
}
