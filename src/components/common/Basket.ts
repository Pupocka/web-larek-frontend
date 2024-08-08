import { createElement, ensureElement, formatNumber } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

interface IBasket {
  items: HTMLElement[];
  total: number;
  disabled: boolean;
}

export class Basket extends Component<IBasket> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  button: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLElement>('.basket__price', this.container);
    this.button = this.container.querySelector('.basket__button');

    if (this.button) {
      this.button.textContent = 'Открыть заказ';
      this.button.addEventListener('click', () => {
        events.emit('order:open');
      });
    }

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
    } else {
      this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'Корзина пуста'
      }));
    }
  }

  set selected(items: string[]) {
    if (items.length) {
        this.setDisabled(this.button, false);
    } else {
        this.setDisabled(this.button, true);
    }
}
  set total(total: number) {
    this.setText(this._total, `${formatNumber(total)} синапсов`);
  }
}
