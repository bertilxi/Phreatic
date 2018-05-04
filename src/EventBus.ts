const listeners = {};

export const eventBus = Object.freeze({
  emit(event: string, data?) {
    if (listeners[event]) {
      listeners[event].forEach(listener => listener(data));
    }
  },
  on(event: string, listener: (data) => void) {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event].push(listener);
  },
  unsubscribe(listener: (data) => void) {
    Object.values(listeners).forEach((value: any[]) => {
      const index = value.indexOf(listener);
      if (index > -1) {
        value.splice(index, 1);
      }
    });
  }
});
