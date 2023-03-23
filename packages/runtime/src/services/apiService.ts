import mitt from 'mitt';
export type ApiService = ReturnType<typeof initApiService>;

export function initApiService() {
  const emitter = mitt<{
    /**
     * @description: trigger component's method
     * @example: { componentId: "btn1", name: "click" }
     */
    uiMethod: {
      componentId: string;
      name: string;
      triggerId: string;
      eventType: string;
      parameters?: any;
    };
    moduleEvent: {
      fromId: string;
      eventType: string;
    };
    /**
     * @description: record merge state info for debug
     */
    mergeState: Record<string, any>;
  }>();
  const apiService = {
    on: emitter.on,
    off: emitter.off,
    send: emitter.emit,
  };

  return apiService;
}
