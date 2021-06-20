class Observer {

  constructor() {
    this.events = null
  }

  on(name, fn) {
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
      remove: (name, fn) => this.remove(name, fn)
    }
  }

  emit(name, args) {
    if (!this.events) return;

    const events = this.events[name];
    if (!!events) {
      events.forEach(fn => {
        fn(args)
      })
    }
  }

  remove(name, fn) {
    if (!this.events) return;

    const events = this.events[name];

    if (!!events) {
      this.events[name] = events.filter(item => item == fn);
    }
  }

  clear() {
    this.events = null;
  }


  once(name, fn) {
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

export default Observer;