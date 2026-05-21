import './scss/styles.scss';
import { Api } from './components/base/Api';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { LarekApi } from './components/models/LarekApi';
import { Products } from './components/models/Products';
import { IProduct } from './types';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';

const products = new Products();
const basket = new Basket();
const buyer = new Buyer();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

products.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', products.getItems());

const firstProduct: IProduct = apiProducts.items[0];
const secondProduct: IProduct = apiProducts.items[1];

console.log('Товар по id:', products.getItem(firstProduct.id));

products.setPreview(firstProduct);
console.log('Товар для подробного просмотра:', products.getPreview());

basket.addItem(firstProduct);
basket.addItem(secondProduct);
console.log('Товары в корзине после добавления:', basket.getItems());
console.log('Общая стоимость корзины:', basket.getTotal());
console.log('Количество товаров в корзине:', basket.getCount());
console.log('Проверка наличия товара в корзине:', basket.hasItem(firstProduct.id));

basket.removeItem(firstProduct);
console.log('Корзина после удаления товара:', basket.getItems());

basket.clear();
console.log('Корзина после очистки:', basket.getItems());

buyer.setData({ payment: 'card', address: 'ул. Пушкина, дом Колотушкина' });
console.log('Данные покупателя после первого шага:', buyer.getData());
console.log('Ошибки валидации после первого шага:', buyer.validate());

buyer.setData({ email: 'test@example.com', phone: '+7 999 123-45-67' });
console.log('Полные данные покупателя:', buyer.getData());
console.log('Ошибки валидации после заполнения:', buyer.validate());

buyer.clear();
console.log('Данные покупателя после очистки:', buyer.getData());

larekApi
    .getProducts()
    .then((response) => {
        products.setItems(response.items);
        console.log('Каталог товаров, полученный с сервера:', products.getItems());
    })
    .catch((error: unknown) => {
        console.error('Ошибка при получении каталога с сервера:', error);
    });
