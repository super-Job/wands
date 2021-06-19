
interface Events {
  [key: string]: Array<Function>
}

export default class Observer {
  events: Events | null;

  constructor() {
    this.events = null
  }

  public on(name: string, fn: Function) {
    if (!this.events) {
      this.events = {};
    }

    if (!!this.events[name]) {
      this.events[name].push(fn);
    } else {
      this.events[name] = [fn];
    }

    return {
      name,
      callback: fn,
      remove: (name: string, fn: Function) => this.remove(name, fn)
    }
  }

  public emit(name: string, args: any) {
    if (!this.events) return;

    const events = this.events[name];
    if (!!events) {
      events.forEach(fn => {
        fn(args)
      })
    }
  }

  public remove(name: string, fn: Function) {
    if (!this.events) return;

    const events = this.events[name];

    if (!!events) {
      this.events[name] = events.filter(item => item == fn);
    }
  }

  public clear() {
    this.events = null;
  }


  public once(name: string, fn: Function) {
    if (!this.events) {
      this.events = {};
    };

    const func = (...args) => {
      fn(...args);
      setTimeout(() => {
        this.remove(name, func);
      }, 0);
    }

    this.on(name, func);
  }

}