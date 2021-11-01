import mitt from 'mitt';

const emitter = mitt<{
  /**
   * @description: trigger component's method
   * @example: { componentId: "btn1", name: "click" }
   */
  uiMethod: {
    componentId: string;
    name: string;
    parameters?: any;
  };
  moduleEvent: {
    fromId: string;
    eventType: string;
  };
}>();

export type ApiService = ReturnType<typeof initApiService>;

export function initApiService() {
  return {
    on: emitter.on,
    off: emitter.off,
    send: emitter.emit,
  };
}
