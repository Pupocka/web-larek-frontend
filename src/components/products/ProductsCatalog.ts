import { Model } from "../base/Model";
import { FormErrors, IOrder, IOrderForm, IProduct } from "../../types";

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
        this.emitChanges('products:changed');
    }

    addItem(action: 'addOrderID' | 'addToBasket', item: IProduct) {
        switch (action) {
            case 'addOrderID':
                this.order.items.push(item.id);
                break;
            case 'addToBasket':
                this.basket.push(item);
                break;
        }
    }
    
    removeItem(context: 'order' | 'basket', item: IProduct) {
        let targetList = context === 'order' ? this.order.items : this.basket;
        const index = targetList.findIndex(i => typeof i === 'object' && i.id === item.id);
            if (index >= 0) {
            targetList.splice(index, 1);
        }
    }
    
    clearBasket() {
		this.basket = [];
		this.order.items = [];
	}

    containsProduct(item: IProduct) {
		return this.basket.includes(item);
	}

    getTotalOrder(): number {
        return this.basket.reduce((total, item) => {
            const itemPrice = this.catalog.find(it => it.id === item.id)?.price ?? 0;
            return total + itemPrice;
        }, 0);
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateForm()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateForm(): boolean {
        const errors: Partial<FormErrors> = {};
        if (!this.order.address) errors.address = 'Необходимо указать адрес';
        if (!this.order.payment) errors.payment = 'Необходимо выбрать способ оплаты';
        if (!this.order.email) errors.email = 'Необходимо указать email';
        if (!this.order.phone) errors.phone = 'Необходимо указать телефон';
    
        this.formErrors = errors;
        this.emitChanges('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    get isBasketEmpty(): boolean {
        return this.basket.length === 0;
    }
}