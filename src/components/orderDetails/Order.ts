import { IOrderForm } from "../../types";
import { ensureAllElements } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "../common/Form";


export class Order extends Form<IOrderForm> {
  protected _buttons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', container);
    this._buttons.forEach(button => {
      button.addEventListener('click', () => {
        this.payment = button.name; 
        events.emit('order:set-payment-type', button)
      });
    })
  }

  set payment(name: string) {
    this._buttons.forEach(button => {
      this.toggleClass(button, 'button_alt-active', button.name === name);
    });
  }

  set address(value: string) {
    const input = this.container.querySelector<HTMLInputElement>('input[name="address"]');
      if (input) {
        input.value = value;
    }
  }
}
