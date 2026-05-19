import { IBuyer, TPayment } from "../../types";

export class UserModel {
  protected _payment: TPayment | null = null;
  protected _address: string = '';
  protected _email: string = '';
  protected _phone: string = '';

  setUserData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.address !== undefined) this._address = data.address;
    if (data.email !== undefined) this._email = data.email;
    if (data.phone !== undefined) this._phone = data.phone;
  }

  getUserData(): IBuyer {
    return {
      payment: this._payment || 'card',
      address: this._address,
      email: this._email,
      phone: this._phone,
    };
  }

  clear(): void {
    this._payment = null;
    this._address = '';
    this._email = '';
    this._phone = '';
  }

  protected validateFields(fields: (keyof IBuyer)[]): Record<string, string> {
    const errors: Record<string, string> = {};

    if (fields.includes('payment') && !this._payment) {
      errors.payment = 'Не выбран вид оплаты';
    }

    if (fields.includes('address') && !this._address) {
      errors.address = 'Укажите адрес доставки';
    }
    
    if (fields.includes('email') && !this._email) {
      errors.email = 'Укажите email';
    }

    if (fields.includes('phone') && !this._phone) {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }

  validate(): Record<string, string> {
    return this.validateFields(['payment', 'address', 'email', 'phone']);
  }

  validateOrderStep(): string[] {
    return Object.values(this.validateFields(['payment', 'address']));
  }

  validateContactsStep(): string[] {
    return Object.values(this.validateFields(['email', 'phone']));
  }
}
