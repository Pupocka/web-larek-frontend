import { ensureElement } from "../../utils/utils";
import { Product, IProductActions } from "./Product";


export class ProductPreview extends Product {
  protected _index: HTMLElement;
	protected _description: HTMLElement
  button: HTMLElement;

  constructor(container: HTMLElement, actions?: IProductActions) {
    super(container, actions);

    this.button = ensureElement<HTMLElement>(`.card__button`, container);
    this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
    this._description = ensureElement<HTMLElement>(`.card__text`, container);

		if (actions?.onClick && this.button) {
      this.button.addEventListener('click', actions.onClick);
    }
  }

  set index(value: number) {
    this.setText(this._index, value.toString());
  }

  set description(value: string) {
    this.setText(this._description, value);
  }
}