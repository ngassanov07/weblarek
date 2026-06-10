# Проектная работа "Веб-ларек"

Интернет-магазин с каталогом товаров, корзиной и оформлением заказа.

**Стек:** HTML, SCSS, TypeScript, Vite

## Установка и запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

---

## Архитектура приложения

Приложение построено по паттерну **MVP (Model-View-Presenter)**:

- **Model** — слой данных, отвечает за хранение и управление состоянием
- **View** — слой представления, отвечает за отображение и взаимодействие с пользователем
- **Presenter** — слой логики, координирует взаимодействие между Model и View через события

### Структура проекта

```
src/
├── components/
│   ├── base/              # Базовые классы
│   │   ├── Api.ts        # HTTP запросы
│   │   ├── Component.ts  # Базовый класс для компонентов
│   │   └── Events.ts     # Брокер событий
│   ├── models/           # Слой данных (Model)
│   │   ├── Products.ts   # Каталог товаров
│   │   ├── Basket.ts     # Корзина
│   │   ├── Buyer.ts      # Данные покупателя
│   │   └── LarekApi.ts   # API магазина
│   └── view/             # Слой представления (View)
│       ├── Gallery.ts
│       ├── Card.ts
│       ├── Modal.ts
│       ├── Basket.ts
│       ├── BasketItem.ts
│       ├── Form.ts
│       ├── OrderForm.ts
│       ├── ContactsForm.ts
│       ├── Success.ts
│       └── Header.ts
├── types/
│   └── index.ts          # Типы TypeScript
├── utils/
│   ├── constants.ts      # Константы
│   ├── data.ts           # Тестовые данные
│   └── utils.ts          # Утилиты
├── scss/
│   └── styles.scss       # Стили
└── main.ts               # Presenter (точка входа)
```

---

## Базовый код

### Класс Component

Абстрактный базовый класс для всех компонентов представления.

**Конструктор:**
```typescript
constructor(protected readonly container: HTMLElement)
```

**Методы:**
- `render(data?: Partial<T>): HTMLElement` — отрисовка компонента с данными
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` — установка изображения

### Класс Api

Базовый класс для выполнения HTTP-запросов.

**Конструктор:**
```typescript
constructor(baseUrl: string, options: RequestInit = {})
```

**Методы:**
- `get<T extends object>(uri: string): Promise<T>` — GET запрос
- `post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>` — POST/PUT/DELETE запрос

### Класс EventEmitter

Брокер событий для связи компонентов через событийную архитектуру.

**Методы:**
- `on<T extends object>(event: EventName, callback: (data: T) => void): void` — подписка на событие
- `emit<T extends object>(event: string, data?: T): void` — генерация события
- `trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` — создание триггера события

---

## Типы данных

### IProduct

Интерфейс товара:
```typescript
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```

### IBuyer

Интерфейс данных покупателя:
```typescript
interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}
```

### TPayment

Тип способа оплаты: `'card' | 'cash'`

### ValidationErrors

Объект ошибок валидации: `Partial<Record<keyof IBuyer, string>>`

### IOrder

Интерфейс заказа:
```typescript
interface IOrder extends IBuyer {
    items: string[];    // ID товаров
    total: number;      // Итоговая сумма
}
```

### IProductsResponse

Ответ сервера с каталогом:
```typescript
interface IProductsResponse {
    total: number;
    items: IProduct[];
}
```

### IOrderResponse

Ответ сервера после оформления заказа:
```typescript
interface IOrderResponse {
    id: string;
    total: number;
}
```

---

## Слой модели (Model)

### Products

Управление каталогом товаров и выбранным товаром для просмотра.

**Конструктор:**
```typescript
constructor(events: EventEmitter)
```

**Методы:**
- `setItems(items: IProduct[]): void` — установить каталог товаров
- `getItems(): IProduct[]` — получить все товары
- `getItem(id: string): IProduct | undefined` — получить товар по ID
- `setPreview(item: IProduct | null): void` — установить товар для просмотра
- `getPreview(): IProduct | null` — получить товар для просмотра

**События:**
- `products:changed` — каталог товаров изменился
- `preview:changed` — товар для просмотра изменился

### Basket

Управление корзиной покупок.

**Конструктор:**
```typescript
constructor(events: EventEmitter)
```

**Методы:**
- `addItem(item: IProduct): void` — добавить товар в корзину
- `removeItem(item: IProduct): void` — удалить товар из корзины
- `getItems(): IProduct[]` — получить товары в корзине
- `clear(): void` — очистить корзину
- `getTotal(): number` — получить сумму товаров
- `getCount(): number` — получить количество товаров
- `hasItem(id: string): boolean` — проверить наличие товара

**События:**
- `basket:changed` — состояние корзины изменилось

### Buyer

Управление данными и валидацией покупателя.

**Конструктор:**
```typescript
constructor(events: EventEmitter)
```

**Методы:**
- `setData(data: Partial<IBuyer>): void` — установить данные покупателя
- `getData(): Partial<IBuyer>` — получить данные покупателя
- `clear(): void` — очистить данные
- `validate(): ValidationErrors` — валидировать данные

**События:**
- `buyer:changed` — данные покупателя изменились

---

## Слой представления (View)

### Gallery

Отображение каталога товаров.

**Методы:**
- `render(items?: HTMLElement[]): HTMLElement` — отрисовка галереи

### Card

Компонент карточки товара (используется в каталоге и в модальном окне).

**Параметры:**
- `container: string | HTMLElement` — селектор шаблона
- `onClick?: () => void` — обработчик клика

**Сеттеры:**
- `title: string` — название товара
- `image: string` — путь к изображению
- `description: string` — описание товара
- `price: number | null` — цена товара
- `category: string` — категория товара
- `button: string` — текст кнопки
- `buttonDisabled: boolean` — заблокировать кнопку

### Modal

Модальное окно для отображения содержимого.

**Методы:**
- `open(): void` — открыть модаль
- `close(): void` — закрыть модаль
- `render(data?: HTMLElement): HTMLElement` — установить содержимое

**События:**
- `modal:open` — модаль открылась
- `modal:close` — модаль закрылась

### Header

Заголовок с счётчиком товаров в корзине.

**Событие:**
- `basket:open` — клик по корзине

### BasketView

Отображение содержимого корзины.

**События:**
- `basket:order` — нажата кнопка оформления
- `basket:remove` — удаление товара из корзины

### BasketItem

Элемент товара в корзине.

### Form

Базовый класс для форм.

**События:**
- `form:change` — значение поля изменилось
- `form:submit` — отправка формы

### OrderForm

Форма первого шага оформления (способ оплаты и адрес).

### ContactsForm

Форма второго шага оформления (email и телефон).

### Success

Модальное окно успешного оформления заказа.

**Событие:**
- `success:close` — закрытие окна успеха

---

## Слой логики (Presenter)

Логика приложения реализована в `main.ts` с использованием системы событий.

### Основной поток:

1. **Загрузка товаров** → LarekApi получает каталог → `products:changed`
2. **Отображение галереи** → обработчик `products:changed` отрисовывает карточки
3. **Клик по товару** → `preview:changed` → открытие модали с товаром
4. **Добавление в корзину** → `basket:changed` → обновление счётчика
5. **Открытие корзины** → отображение модали с товарами
6. **Оформление заказа** → первая форма (оплата + адрес) → вторая форма (контакты)
7. **Отправка заказа** → LarekApi.createOrder → сообщение об успехе → очистка корзины

### События приложения

#### События Model:

- `products:changed` — каталог товаров обновлён
- `preview:changed` — выбран товар для просмотра
- `basket:changed` — состояние корзины изменилось
- `buyer:changed` — данные покупателя изменились

#### События View:

- `basket:open` — открыть модаль корзины
- `basket:remove` — удалить товар из корзины (с данными `{ id }`)
- `basket:order` — открыть форму оформления
- `form:change` — изменение поля формы (с данными `{ field, value, form }`)
- `form:submit` — отправка формы (с данными `{ form }`)
- `success:close` — закрытие окна успеха
- `modal:open` — открытие модали (внутреннее)
- `modal:close` — закрытие модали (внутреннее)

---

## Слой коммуникации

### LarekApi

Класс для работы с API магазина.

**Конструктор:**
```typescript
constructor(api: IApi)
```

**Методы:**
- `getProducts(): Promise<IProductsResponse>` — получить каталог товаров
- `createOrder(order: IOrder): Promise<IOrderResponse>` — оформить заказ

---

## Функциональность

✅ Отображение каталога товаров
✅ Открытие карточки товара в модальном окне
✅ Добавление/удаление товаров в корзину
✅ Отображение счётчика товаров в корзине
✅ Открытие и отображение корзины
✅ Двухшаговое оформление заказа
✅ Валидация данных формы
✅ Отправка заказа на сервер
✅ Сообщение об успехе
✅ Закрытие модалей по крестику и клику вне модали

---

## Примечания

- Все данные хранятся только в моделях (Model)
- View компоненты не содержат логику, только отображение
- Presenter координирует взаимодействие через события
- Формы валидируются в реальном времени
- Блокировка кнопок при наличии ошибок валидации
