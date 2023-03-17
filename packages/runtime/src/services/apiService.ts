import mitt from 'mitt';
import { DebugLoggerType } from './debug';
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
      parameters?: any;
    };
    moduleEvent: {
      fromId: string;
      eventType: string;
    };
    /**
     * @description: record debug info
     */
    debug: {
      type: DebugLoggerType;
    } & Record<string, any>;
  }>();
  const apiService = {
    on: emitter.on,
    off: emitter.off,
    send: emitter.emit,
  };

  return apiService;
}
