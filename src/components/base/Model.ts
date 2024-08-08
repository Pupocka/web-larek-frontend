import { IEvents } from "./events";

export abstract class Model<T> {
  protected events: IEvents;

  constructor(data: Partial<T>, events: IEvents) {
    Object.assign(this, data);
    this.events = events;
  }

  emitChanges(event: string, payload?: object) {
      this.events.emit(event, payload ?? {});
  }
}