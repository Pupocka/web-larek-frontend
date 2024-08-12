export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {
}

toggleClass(element: HTMLElement, className: string, force?: boolean): void {
  element.classList.toggle(className, force ?? false);
}

setDisabled(element: HTMLElement, state: boolean): void {
  if (state) {
    element.setAttribute('disabled', '');
  } else {
    element.removeAttribute('disabled');
  }
}

protected setText(element: Element, value: unknown): void {
  if (element instanceof HTMLElement) {
    element.textContent = String(value);
  }
}

protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
  if (element) {
    element.src = src;
    if (alt) {
      element.alt = alt;
    }
  }
}

render(data?: Partial<T>): HTMLElement {
  if (data) {
    Object.assign(this, data);
  }
  return this.container;
}
}
