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
  protected _category?: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _price: HTMLElement;
  protected _description?: HTMLElement;
  protected _index?: HTMLElement; 
  button?: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: IProductActions) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.card__title`, container);
    this._image = container.querySelector(`.${blockName}__image`);
    this._price = container.querySelector(`.${blockName}__price`);
    this._description = container.querySelector(`.${blockName}__description`);
    this._index = container.querySelector(`.basket__item-index`)
    this._category = container.querySelector(`.${blockName}__category`)
    this.button = container.querySelector(`.${blockName}__button`);

    if (actions?.onClick) {
        if (this.button) {
          this.button.addEventListener('click', actions.onClick);
        } else {
          container.addEventListener('click', actions.onClick);
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

	set price(value: number) {
		value === null ? this.setText(this._price, 'Бесценно') : this.setText(this._price, `${value} синапсов`);
	}

	set image(value: string) {
		this.setImage(this._image, value);
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

  set description(value: string) {
		this.setText(this._description, value);
	}
    
	set index(value: number) {
		this.setText(this._index, value);
	}
}
