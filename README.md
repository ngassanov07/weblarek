# Проектная работа "Веб-ларек"

Интернет-магазин цифровых товаров «Web-Larek». Пользователь может просмотреть каталог, добавить товары в корзину и оформить заказ в два шага. Приложение построено на архитектуре MVP с событийной моделью.

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/models/ — модели данных
- src/components/views/ — компоненты представления

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения и презентер
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами
- src/utils/events.ts — константы событий приложения

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

Взаимодействие между слоями происходит через брокер событий `EventEmitter`. Компоненты представления и модели генерируют события, а презентер в `main.ts` их обрабатывает.

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

`IBuyer` - интерфейс данных покупателя:
- `payment: TPayment`
- `email: string`
- `phone: string`
- `address: string`

`IBuyerData` - данные покупателя в модели:
- `payment: TPayment | null`
- `email: string`
- `phone: string`
- `address: string`

`ValidationErrors` - тип объекта ошибок валидации. Построен на основе полей `IBuyer`, поэтому автоматически остается связанным с типом покупателя.

`IOrder` - интерфейс заказа:
- все поля `IBuyer`
- `items: string[]`
- `total: number`

`IProductsResponse` - интерфейс ответа сервера с каталогом товаров:
- `total: number`
- `items: IProduct[]`

`IOrderResponse` - интерфейс ответа сервера после оформления заказа:
- `id: string`
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

Конструктор:
`constructor(events: IEvents)`

Поля:
- `items: IProduct[]` — каталог товаров
- `preview: IProduct | null` — выбранный для просмотра товар
- `events: IEvents` — брокер событий

Методы:
- `setItems(items: IProduct[]): void`
- `getItems(): IProduct[]`
- `getItem(id: string): IProduct | undefined`
- `setPreview(item: IProduct): void`
- `getPreview(): IProduct | null`

При изменении данных генерирует события `catalog:change` и `preview:change`.

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

Конструктор:
`constructor(events: IEvents)`

Поля:
- `items: IProduct[]` — товары в корзине
- `events: IEvents` — брокер событий

Методы:
- `getItems(): IProduct[]`
- `addItem(item: IProduct): void`
- `removeItem(item: IProduct): void`
- `clear(): void`
- `getTotal(): number`
- `getCount(): number`
- `hasItem(id: string): boolean`

При изменении данных генерирует событие `basket:change`.

### Интерфейс IBuyerModel

Описывает модель данных покупателя.

Методы:
- `setData(data: Partial<IBuyer>): void`
- `getData(): Partial<IBuyer>`
- `clear(): void`
- `validate(): ValidationErrors`

### Класс Buyer

Хранит данные покупателя и валидирует их.

Конструктор:
`constructor(events: IEvents)`

Поля:
- `data: IBuyerData` — данные покупателя
- `events: IEvents` — брокер событий

Методы:
- `setData(data: Partial<IBuyerData>): void`
- `getData(): IBuyerData`
- `clear(): void`
- `validate(): ValidationErrors`

При изменении данных генерирует событие `buyer:change`.

## Слой коммуникации

### Класс LarekApi

Работает с сервером интернет-магазина через базовый класс `Api`.

Конструктор:
`constructor(api: IApi)`

Поля:
- `api: IApi` — экземпляр HTTP-клиента

Методы:
- `getProducts(): Promise<IProductsResponse>`
- `createOrder(order: IOrder): Promise<IOrderResponse>`

## Слой представления

### Класс Card

Абстрактный родительский класс для карточек товара.

Конструктор:
`constructor(container: HTMLElement)`

Поля:
- `titleElement: HTMLElement`
- `priceElement: HTMLElement`

Методы:
- `setPrice(price: number | null): void`
- `render(data?: Partial<CardData>): HTMLElement`

### Класс CardCatalog

Карточка товара в каталоге. Наследует `Card`.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)`

Поля:
- `categoryElement: HTMLElement`
- `imageElement: HTMLImageElement`

Методы:
- `setCategory(category: string): void`
- `render(data?: Partial<CardData & { id: string; category: string; image: string }>): HTMLElement`

Генерирует событие `card:select` при клике на карточку.

### Класс CardPreview

Карточка товара для подробного просмотра. Наследует `Card`.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)`

Поля:
- `categoryElement: HTMLElement`
- `imageElement: HTMLImageElement`
- `descriptionElement: HTMLElement`
- `buttonElement: HTMLButtonElement`

Методы:
- `setCategory(category: string): void`
- `render(data?: Partial<CardData & { id: string; category: string; image: string; description: string; inBasket: boolean }>): HTMLElement`

Генерирует событие `card:action` при нажатии на кнопку покупки.

### Класс CardBasket

Карточка товара в корзине. Наследует `Card`.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)`

Поля:
- `indexElement: HTMLElement`
- `deleteButton: HTMLButtonElement`

Методы:
- `render(data?: Partial<CardData & { id: string; index: number }>): HTMLElement`

Генерирует событие `card:remove` при удалении товара.

### Класс Form

Абстрактный родительский класс для форм оформления заказа.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)`

Поля:
- `submitButton: HTMLButtonElement`
- `errorsElement: HTMLElement`

Методы:
- `setErrors(errors: string): void`
- `setSubmitEnabled(enabled: boolean): void`
- `render(data?: Partial<FormRenderData>): HTMLElement`
- `onSubmit(): void` — абстрактный метод

### Класс Order

Форма первого шага оформления заказа. Наследует `Form`.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)`

Поля:
- `cardButton: HTMLButtonElement`
- `cashButton: HTMLButtonElement`
- `addressInput: HTMLInputElement`

Методы:
- `onSubmit(): void`
- `render(data?: Partial<IBuyer & FormRenderData>): HTMLElement`

Генерирует события `form:change` и `order:next`.

### Класс Contacts

Форма второго шага оформления заказа. Наследует `Form`.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)`

Поля:
- `emailInput: HTMLInputElement`
- `phoneInput: HTMLInputElement`

Методы:
- `onSubmit(): void`
- `render(data?: Partial<IBuyer & FormRenderData>): HTMLElement`

Генерирует события `form:change` и `order:submit`.

### Класс Modal

Компонент модального окна.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)`

Поля:
- `contentElement: HTMLElement`
- `closeButton: HTMLButtonElement`

Методы:
- `open(): void`
- `close(): void`
- `setContent(content: HTMLElement): void`
- `render(): HTMLElement`

Генерирует событие `modal:close` при закрытии окна.

### Класс Gallery

Компонент каталога товаров на главной странице.

Конструктор:
`constructor(container: HTMLElement)`

Методы:
- `render(items?: HTMLElement[]): HTMLElement`

### Класс Header

Компонент шапки сайта со счётчиком корзины.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)`

Поля:
- `basketButton: HTMLButtonElement`
- `counterElement: HTMLElement`

Методы:
- `render(data?: Partial<{ count: number }>): HTMLElement`

Генерирует событие `basket:open` при нажатии на иконку корзины.

### Класс BasketView

Компонент корзины.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)`

Поля:
- `listElement: HTMLUListElement`
- `priceElement: HTMLElement`
- `orderButton: HTMLButtonElement`

Методы:
- `render(data?: Partial<{ items: HTMLElement[]; total: number; isEmpty: boolean }>): HTMLElement`

Генерирует событие `order:open` при нажатии на кнопку оформления.

### Класс OrderSuccess

Компонент экрана успешного оформления заказа.

Конструктор:
`constructor(container: HTMLElement, events: IEvents)`

Поля:
- `descriptionElement: HTMLElement`
- `closeButton: HTMLButtonElement`

Методы:
- `render(data?: Partial<{ total: number }>): HTMLElement`

Генерирует событие `modal:close` при нажатии на кнопку закрытия.

## События приложения

### События моделей данных

Модели генерируют события без передачи данных. Актуальные данные презентер получает через методы модели.

- `catalog:change` — изменился каталог товаров
- `preview:change` — изменился товар для просмотра
- `basket:change` — изменилось содержимое корзины
- `buyer:change` — изменились данные покупателя

### События представления

- `basket:open` — нажата кнопка открытия корзины
- `card:select` — выбрана карточка для просмотра. Данные: `{ id: string }`
- `card:action` — нажата кнопка покупки в карточке предпросмотра
- `card:remove` — нажата кнопка удаления товара. Данные: `{ id: string }`
- `order:open` — нажата кнопка оформления заказа
- `order:next` — нажата кнопка перехода ко второй форме
- `order:submit` — нажата кнопка оплаты
- `form:change` — изменены данные в форме. Данные: `Partial<IBuyer>`
- `modal:close` — закрыто модальное окно

Действия карточек каталога и корзины обрабатываются через колбэки, эмитирующие события из презентера.

## Презентер

Логика приложения реализована в файле `src/main.ts` без выделения в отдельный класс.

Презентер:
- создаёт экземпляры моделей, представлений и API;
- подписывается на все события приложения;
- обрабатывает действия пользователя и обновляет модели;
- перерисовывает представления при изменении данных в моделях;
- открывает модальные окна, передавая актуальную разметку представлений;
- не генерирует события и не хранит состояние приложения.

Валидация выполняется через `buyer.validate()`. Для отправки заказа презентер проверяет результат `validate()` и берёт данные через `getData()`.

При запуске приложения презентер инициализирует модели через `basket.clear()` и `buyer.clear()`, затем загружает каталог товаров с сервера.

**https://github.com/ngassanov07/weblarek.git**
