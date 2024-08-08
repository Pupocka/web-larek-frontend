import { IProduct, } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

const ProductCategories: Record<string, string> = {
  'софт-скил': 'soft',
  'другое': 'other',
  'хард-скил': 'hard',
  'дополнительное': 'additional',
  'кнопка': 'button'
};
export interface IProductActions {
  onClick: (event: MouseEvent) => void;
}

export class Product extends Component<IProduct> {
  protected _title: HTMLElement;
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement, actions?: IProductActions) {
    super(container);
    this._title = ensureElement<HTMLElement>(`.card__title`, container);
    this._category = ensureElement<HTMLElement>(`.card__category`, container);
    this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
    this._price = ensureElement<HTMLElement>(`.card__price`, container);

    if (actions?.onClick) {
      container.addEventListener('click', actions.onClick);
    }
  }

	get id(): string {
    return this.container.dataset.id || '';
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set image(value: string) {
    this.setImage(this._image, value);
  }

  set price(value: number | null) {
    this.setText(this._price, value === null ? 'Бесценно' : `${value} синапсов`);
  }

  set category(value: string) {
    const categoryClass = ProductCategories[value];
    if (!categoryClass) {
      console.warn(`Unknown product category: ${value}`);
      return;
    }
    this.setText(this._category, value);
    this._category.className = `card__category card__category_${categoryClass}`;
  }
}



