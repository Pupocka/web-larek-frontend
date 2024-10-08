# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении. 

  Товар
```
  interface IProduct {
  id: string;
  description?: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  index?: number;
  }
```

  Заказ
```
interface IOrder extends IOrderForm{
  total: number;
  items: string[];
}

interface IOrderForm {
  email?: string;
  phone?: string;
  address?: string;
  payment?: string;
}

interface IOrderResult {
	total: number;
  id: string;
}
```
  Ошибки
```
  type FormErrors = Partial<Record<keyof IOrder, string>>;
```

## Архитерктура приложения  

 Код приложения разделен на слои согласно парадигме MVP:

- слой представления, отвечает за отображение данных на странице
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных

## Базовый код

### Класс API

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Методы:

`get(uri: string)` - выполняет `GET` запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер\
`post(uri: string, data: object, method: ApiPostMethods = 'POST')` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.\
`handleResponse(response: Response)` - защищенный метод, в случае успеха выполнения запроса возвращает объект в виде json. В случае неуспеха - статус и текст ошибки. Принимает в параметрах Response

### Класс EventEmmiter

Реализует паттерн `«Наблюдатель»` и позволяет подписываться на события и уведомлять подписчиков о наступлении события.

 Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

`on(eventName: EventName, callback: (event: T) => void)` - Установить обработчик на событие\
`off(eventName: EventName, callback: Subscriber)` - Снять обработчик с события\
`emit(eventName: string, data?: T)` - Инициировать событие с данными\
`onAll(callback: (event: EmitterEvent) => void)` - Слушать все события\
`offAll()` - Сбросить все обработчики\
`trigger(eventName: string, context?: Partial<T>)` - Сделать коллбек триггер, генерирующий событие при вызове

### Класс Model

Абстрактный класс дженерик, обобщающий в себе конструктор и метод привязки события.

`emmitChanges` — регистрирует входящее событие в `EventEmitter`

### Класс Component

Данный класс представляет собой абстрактный базовый класс для компонентов пользовательского интерфейса в веб-приложениях. Он предназначен для наследования другими классами, которые реализуют конкретные компоненты интерфейса. Класс предоставляет набор общих методов для работы с элементами DOM и их свойствами.

`Конструктор` класса принимает один аргумент — элемент DOM (HTMLElement), который служит контейнером для компонента. Этот элемент становится доступным через защищенное свойство container, что позволяет дочерним классам обращаться к нему для манипуляций с DOM внутри своего контейнера.

Основные методы, реализуемые классом:

`toggleClass` — используется для переключения CSS-класса (className) на указанном элементе DOM (element).\
`setDisabled` — устанавливает атрибут disabled для указанного элемента DOM (element) в зависимости от значения параметра state.\
`setText` — устанавливает текстовое содержимое (textContent) указанного элемента DOM (element).\
`setImage` — Метод setImage используется для установки источника изображения (src) и альтернативного текста (alt, необязательно) для указанного элемента изображения (HTMLImageElement). Если альтернативный текст предоставлен, он также устанавливается для элемента изображения.\
`render` — предназначен для рендеринга данных в интерфейсе компонента.

## Слой данных(Model)

### Класс LarekApi

Класс `LarekApi` представляет собой расширение базового класса Api, предназначенного для взаимодействия с API. Этот класс специализирован для работы с API, связанным с каталогом продуктов и оформлением заказов. Класс включает в себя две основные функции: получение списка продуктов (getCatalog) и отправку информации о заказе (order).

Конструктор класса принимает три параметра:

`cdn`: Строка, указывающая URL CDN (Content Delivery Network), которое может использоваться для загрузки статических ресурсов, таких как изображения продуктов.\
`baseUrl`: Базовый URL API, к которому будут отправляться запросы.\
`options`: Необязательный параметр, содержащий дополнительные настройки для инициализации базового класса Api.

Основные методы, реализуемые классом:

`getCatalog` — предназначен для получения списка продуктов из API.\
`order` — используется для отправки информации о заказе в API.

### Класс ProductsCatalog

Класс `ProductsCatalog` представляет собой модель каталога товаров, которая включает в себя функционал для управления товарами в каталоге, корзине покупок и данными заказа. Этот класс наследуется от базовой модели `Model<IProductCatalog>`, что позволяет ему использовать общий набор функций для управления состоянием и событиями.

Свойства

`catalog`: Массив товаров, представляющих собой каталог продуктов.\
`basket`: Массив товаров, добавленных в корзину покупок.\
`formErrors`: Объект для хранения ошибок формы заказа.\
`order`: Объект, содержащий информацию о текущем заказе, включая список товаров, общую стоимость, способ оплаты, адрес доставки, email и телефон.

Методы

`setCatalog(items: IProduct[])`: Устанавливает список товаров в каталоге и генерирует событие об изменении списка продуктов.\
`addItem(action: 'addOrderID' | 'addToBasket', item: IProduct)`: Добавляет товар в заказ или корзину в зависимости от переданного действия.\
`removeItem(context: 'order' | 'basket', item: IProduct)`: Удаляет товар из заказа или корзины.\
`clearBasket()`: Очищает корзину покупок и список товаров в заказе.\
`containsProduct(item: IProduct)`: Проверяет, содержится ли товар в корзине покупок.\
`getTotalOrder()`: Вычисляет общую стоимость заказа на основе цен товаров в корзине.\
`setOrderField(field: keyof IOrderForm, value: string)`: Устанавливает значение поля заказа и проверяет форму на валидность.\
`validateForm()`: Проверяет форму заказа на наличие ошибок и генерирует событие об изменении ошибок формы.\
`isBasketEmpty`: Геттер, возвращающий true, если корзина пуста, и false в противном случае.

## Классы представления

Все классы представления отвечают за отображение внутри контейнера (Dom-элемент) передаваемых в них данных.

### Класс Modal

Класс `Modal` представляет собой компонент модального окна, который наследуется от базового класса `Component<IModalData>`. Этот класс предназначен для создания и управления модальными окнами в веб-приложениях.

Свойства

`_closeButton`: Элемент кнопки закрытия модального окна.\
`_content`: Элемент, содержащий основное содержимое модального окна.\
`container`: DOM-элемент, представляющий контейнер модального окна (унаследовано от базового класса).\
`events`: Объект событий для эмиссии и подписки на события.

`Конструктор класса` принимает два параметра: `container` — DOM-элемент, который будет использоваться как контейнер модального окна, и `events` — объект событий. В конструкторе инициализируются элементы кнопки закрытия и содержимого модального окна, а также устанавливаются обработчики событий для закрытия модального окна при клике на кнопку закрытия или вне области содержимого.

Методы

`set content(value: HTMLElement)`: Устанавливает новое содержимое модального окна, заменяя текущее содержимое.\
`open()`: Открывает модальное окно, добавляя к его контейнеру класс modal_active и эмитируя событие 'modal:open'.\
`close()`: Закрывает модальное окно, удаляя класс modal_active из контейнера, очищая содержимое и эмитируя событие 'modal:close'.\
`render(data: IModalData)`: HTMLElement: Рендерит модальное окно с переданными данными, вызывая метод рендеринга базового класса, открывает модальное окно и возвращает контейнер модального окна.

### Класс Product

Класс `Product` представляет собой компонент, предназначенный для работы с карточками товаров в веб-приложении. Этот класс наследуется от базового класса `Component<IProduct>`, что позволяет ему использовать общий набор функций для управления состоянием и рендеринга компонентов.

Свойства

`_title,` `_category`, `_image`, `_price`, `_description`, `_index`: Элементы DOM, используемые для отображения различных аспектов информации о товаре.\
`button`: Опциональный элемент кнопки, который присутствует в зависимости от контекста использования компонента.\
`blockName`: Строка, указывающая на имя блока, которое используется для селекторов CSS при поиске элементов внутри контейнера.\
`container`: DOM-элемент, служащий контейнером для компонента (унаследовано от базового класса).

Конструктор класса принимает три параметра:

`blockName`: Имя блока, используемое для поиска элементов внутри контейнера.\
`container`: DOM-элемент, который будет использоваться как контейнер компонента.\
`actions`: Опциональный объект, содержащий колбэки для обработки пользовательских действий, таких как клики.

Методы установки свойств

`id`: Устанавливает идентификатор товара через атрибут data-id контейнера.\
`title, price, image, category, description, index`: Устанавливают соответствующие значения для элементов DOM, используемых для отображения информации о товаре. Для цены предусмотрена специальная логика для отображения текста "Бесценно", если значение равно null.

### Класс Basket

Класс `Basket` представляет собой компонент корзины покупок в веб-приложении. Этот класс наследуется от базового класса `Component<IBasket>`, что позволяет ему использовать общий набор функций для управления состоянием и рендеринга компонентов.

Свойства

`_list`: Элемент DOM, используемый для отображения списка товаров в корзине.\
`_total`: Элемент DOM, используемый для отображения общей стоимости товаров в корзине.\
`button`: Элемент кнопки, который может быть использован для отправки события о создании заказа при клике.\
`container`: DOM-элемент, служащий контейнером для компонента (унаследовано от базового класса).\
`events`: Объект EventEmitter, позволяющий эмитировать и подписываться на события.

Конструктор класса принимает два параметра:

`container`: DOM-элемент, который будет использоваться как контейнер компонента.\
`events`: Объект EventEmitter, используемый для управления событиями внутри компонента.

Методы

`items`: Устанавливает список элементов DOM, представляющих товары в корзине. Если список пуст, отображается сообщение "Корзина пуста". Также управляет состоянием доступности кнопки оформления заказа.\
`total`: Устанавливает общую стоимость товаров в корзине, форматируя число для отображения.\
`setText`: Устанавливает текстовое содержимое элемента DOM.\
`setDisabled`: Управляет состоянием доступности кнопки или другого элемента.

### Класс Form

Класс `Form` представляет собой компонент формы, который наследуется от базового класса `Component<IFormState>`. Этот класс предназначен для управления формами в веб-приложениях, обеспечивая функциональность для обработки ввода данных пользователем, валидации этих данных и отправки формы. Класс использует обобщённый тип T для определения структуры данных формы, что позволяет создавать формы с различными наборами полей.

Свойства

`_submit`: Элемент кнопки отправки формы.\
`_errors`: Элемент, в котором отображаются сообщения об ошибках валидации.\
`container`: DOM-элемент, служащий контейнером для компонента (унаследовано от базового класса).\
`events`: Объект событий для эмиссии и подписки на события.

Конструктор класса принимает два параметра:

`container`: DOM-элемент формы, который будет использоваться как контейнер компонента.\
`events`: Объект событий, используемый для управления событиями внутри компонента.

Методы

`valid`: Устанавливает состояние доступности кнопки отправки формы на основе переданного булевого значения.\
`errors`: Устанавливает текст сообщения об ошибках валидации в блоке ошибок.\
`render` принимает объект состояния формы, включающий в себя флаги валидности, сообщения об ошибках и другие данные полей формы.

### Класс Success

Класс `Success` расширяет универсальный `Component класс`. Этот класс предназначен для представления компонента в веб-приложении, в частности, уведомления об успешном выполнении модального окна, которое отображается после успешной операции завершения заказа.

Свойства

`_total`: Отображает общую сумму.\
`_close`: Кнопка закрытия.

Конструктор

Принимает элемент-контейнер и actionsобъект.
Инициализирует `_close` и `_total` элементы с помощью ensureElement.

Методы

`set total(value: number)`: Обновляет _total текстовое содержимое элемента, чтобы отобразить общее значение.

### Класс Order

Класс `Order` расширяет базовый класс `Form<IOrderForm>`. Класс предназначен для работы с формой заказа на веб-странице и управляет поведением кнопок выбора способа оплаты и адреса доставки.

Конструктор

Принимает контейнер (HTMLFormElement) и объект событий (IEvents). Инициализирует экземпляр класса, вызывая конструктор родительского класса Form, а также ищет все элементы с классом `.button_alt` внутри контейнера и сохраняет их в массив `_buttons`.

Методы

`payment`: Устанавливает активный способ оплаты среди кнопок. При изменении свойства, метод перебирает все кнопки и добавляет или удаляет класс button_alt-active в зависимости от того, соответствует ли имя кнопки заданному значению.\
`address`: Устанавливает значение поля ввода адреса. Находит элемент ввода по имени address и обновляет его значение.

### Класс Contacts

Класс `Contacts` расширяет базовый класс `Form<IOrderForm>`. Класс предоставляет специализированные методы для установки значений телефона и электронной почты.

Конструктор

Принимает контейнер (HTMLFormElement) и объект событий (IEvents).

Методы

`phone`: Метод для установки значения телефонного номера. Ищет элемент ввода с именем phone в контейнере формы и обновляет его значение.\
`email`: Аналогично методу phone, но устанавливает значение для элемента ввода электронной почты.

### Класс Page

Класс `Page` представляет собой компонент страницы веб-приложения, который расширяет базовый класс `Component<IPage>`. Этот класс используется для управления различными аспектами страницы, включая счетчик корзины, контейнер каталога товаров, обертку страницы и саму корзину.

Конструктор

 Принимает контейнер (HTMLElement) и объект событий (IEvents). Вызывает конструктор родительского класса для инициализации. Затем инициализирует внутренние элементы страницы, используя функцию ensureElement для поиска элементов по их селекторам CSS в контейнере. Также добавляет обработчик события click к элементу корзины, который эмитирует событие `basket:open`.

Методы

`counter`: Устанавливает текст счетчика корзины. Преобразует переданное число в строку и устанавливает ее как текст элемента счетчика.\
`catalog`: Добавляет элементы каталога в контейнер каталога. Принимает массив элементов (HTMLElement[]) и добавляет каждый из них в контейнер.\
`locked`: Тoggles класс page__wrapper_locked у обертки страницы в зависимости от переданного булевого значения, что может использоваться для блокировки или разблокировки содержимого страницы.

## Слой коммуникации

### Взаимодействие компонентов

 Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера. 

 Взаимодействие осуществляется за счет событий генерируемых с поомщью брокера событий и обработчиков этих событий, описанных в `index.ts`

 В  `index.ts` сначала создаются экземпляры всех необходимых классов,  а затем настраивается обработка событий.

## Основные события

`products:changed` - изменение списка товаров\
`basket:add-product` - добавление товара в корзину\
`basket: remove-product` - удаление товара из корзины\
`product:preview` - открытие модалки с товаром\
`basket: create-order` - оформление заказа\
`basket: open` - открытие корзины пользователя\
`formErrors:change` - показ(скрытие) ошибок формы\
`order: set-payment-type` - выбор типа оплаты\
`order:submit` - отправка заказа\
`modal: open` - открытие модалки\
`modal: close` - закрытие модалки
