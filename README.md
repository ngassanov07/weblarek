# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP.

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - слой логики, связывает данные и представление.

## Базовый код

### Класс Component

Базовый класс для компонентов интерфейса.

Конструктор:
`constructor(container: HTMLElement)`

Методы:
- `render(data?: Partial<T>): HTMLElement`
- `setImage(element: HTMLImageElement, src: string, alt?: string): void`

### Класс Api

Базовый класс для выполнения HTTP-запросов.

Конструктор:
`constructor(baseUrl: string, options: RequestInit = {})`

Методы:
- `get(uri: string): Promise<object>`
- `post(uri: string, data: object, method?: ApiPostMethods): Promise<object>`

### Класс EventEmitter

Брокер событий для связи частей приложения.

Методы:
- `on<T extends object>(event: EventName, callback: (data: T) => void): void`
- `emit<T extends object>(event: string, data?: T): void`
- `trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void`

## Данные

### Типы данных

`TPayment` - тип, описывающий доступные способы оплаты. Принимает значения `'card'` или `'cash'`.

`IProduct` - интерфейс товара:
- `id: string`
- `description: string`
- `image: string`
- `title: string`
- `category: string`
- `price: number | null`

`IOrder` - интерфейс заказа:
- `payment: TPayment`
- `email: string`
- `phone: string`
- `address: string`
- `items: string[]`
- `total: number`

## Модели данных

### Интерфейс IProducts

Описывает модель каталога товаров.

Методы:
- `setItems(items: IProduct[]): void`
- `getItems(): IProduct[]`
- `getItem(id: string): IProduct | undefined`
- `setPreview(item: IProduct): void`
- `getPreview(): IProduct | null`

### Класс Products

Хранит массив товаров и товар для предпросмотра.

### Интерфейс IBasket

Описывает модель корзины.

Методы:
- `getItems(): IProduct[]`
- `addItem(item: IProduct): void`
- `removeItem(item: IProduct): void`
- `clear(): void`
- `getTotal(): number`
- `getCount(): number`
- `hasItem(id: string): boolean`

### Класс Basket

Хранит товары, добавленные в корзину.

### Интерфейс IBuyer

Описывает модель данных покупателя.

Методы:
- `setData(data: Partial<Pick<IOrder, 'payment' | 'email' | 'phone' | 'address'>>): void`
- `getData(): Partial<Pick<IOrder, 'payment' | 'email' | 'phone' | 'address'>>`
- `clear(): void`
- `validate(): Partial<Record<'payment' | 'email' | 'phone' | 'address', string>>`

### Класс Buyer

Хранит данные покупателя и валидирует их.

## Слой коммуникации

### Класс LarekApi

Работает с сервером интернет-магазина через базовый класс `Api`.

Конструктор:
`constructor(api: IApi)`

Методы:
- `getProducts(): Promise<{ total: number; items: IProduct[] }>`
- `createOrder(order: IOrder): Promise<{ id: string; total: number }>`

**https://github.com/ngassanov07/weblarek.git**