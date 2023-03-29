import mitt from 'mitt';
export type ApiService = ReturnType<typeof initApiService>;

/**
 * @description: trigger component's method
 * @example: { componentId: "btn1", name: "click" }
 */
export type UIMethodPayload = {
  componentId: string;
  name: string;
  triggerId: string;
  eventType: string;
  parameters?: any;
};

export type ModuleEventPayload = {
  fromId: string;
  eventType: string;
};
export function initApiService() {
  const emitter = mitt<{
    uiMethod: UIMethodPayload;
    moduleEvent: ModuleEventPayload;
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
