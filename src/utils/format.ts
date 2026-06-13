export function formatPrice(price: number | null): string {
    if (price === null) {
        return 'Бесценно';
    }
    return `${price} синапсов`;
}
