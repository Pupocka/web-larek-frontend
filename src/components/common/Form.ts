import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IFormData {
	valid: boolean;
	errors: string[];
	address: string;
	payment: string;
	phone: string;
	email: string;
}

export class Form<T> extends Component<IFormData> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('input', (e: InputEvent) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });

    this.container.addEventListener('submit', (e: SubmitEvent) => {
      e.preventDefault();
      this.events.emit(`form.${this.container.name}:submit`);
    });
  }

  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`form.${this.container.name}.${String(field)}:change`, { field, value });
  }

  set valid(value: boolean) {
    this.setDisabled(this._submit, !value);
  }

  set errors(value: string) {
    this.setText(this._errors, value);
  }

  render(state: Partial<T> & IFormData) {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });
    Object.assign(this, inputs);
    return this.container;
  }
}