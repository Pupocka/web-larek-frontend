import { Model } from "../base/Model";
import { FormErrors, IOrder, IProduct } from "../../types";

export type CatalogChangeEvent = {
    catalog: IProduct[];
};

interface IProductCatalog {
    catalog: IProduct[];
    basket: IProduct[];
    order: IOrder;
    formErrors: FormErrors;
}

export class ProductsCatalog extends Model<IProductCatalog> {
    catalog: IProduct[] = [];
    basket: IProduct[] = [];
    formErrors: FormErrors = {};
    order: IOrder = {
        total: 0,
        items: [],
        payment: '',
        address: '',
        email: '',
        phone: '',
    };

    setCatalog(items: IProduct[]) {
        this.catalog = items;
        this.emitChanges('items:changed');
    }

    addItemToBasket(item: IProduct) {
        this.basket.push(item);
    }

    removeItemFromBasket(item: IProduct) {
        this.basket = this.basket.filter(basketItem => basketItem.id !== item.id);
    }

    emptyBasket() {
        this.basket = [];
    }

    calculateTotal() {
        return this.order.items.reduce(
            (acc, curr) => acc + this.catalog.find(it => it.id === curr)?.price ?? 0,
            0
        );
    }

   isBasketEmpty(): boolean {
    return this.basket.length === 0;
}


validateOrderForm(): boolean {
    const errors: FormErrors = {};
    if (!this.order.address) {
        errors.address = 'Необходимо указать адрес';
    }
    if (!this.order.payment) {
        errors.payment = 'Необходимо выбрать способ оплаты';
    }
    this.formErrors = errors;
    this.emitChanges('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
}


validateContactInfo(): boolean {
    const errors: FormErrors = {};
    if (!this.order.email) {
        errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.emitChanges('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
}


getTotalOrder(): number {
    return this.basket.reduce((total, item) => {
        const itemPrice = this.catalog.find(it => it.id === item.id)?.price ?? 0;
        return total + itemPrice;
    }, 0);
}
}