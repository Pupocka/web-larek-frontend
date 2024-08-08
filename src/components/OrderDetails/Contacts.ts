import { IOrder } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "../common/Form";


export class Contacts extends Form<IOrder> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  set phone(value: string) {
    const input = this.container.querySelector<HTMLInputElement>('input[name="phone"]');
    if (input) {
      input.value = value;
    }
  }

  set email(value: string) {
    const input = this.container.querySelector<HTMLInputElement>('input[name="email"]');
    if (input) {
      input.value = value;
    }
  }
}