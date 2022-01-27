import mitt from 'mitt';
import {
  GLOBAL_UTILS_ID,
  GLOBAL_MODULE_ID
} from '../constants';

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
  }>();
  const apiService = {
    on: emitter.on,
    off: emitter.off,
    send: emitter.emit,
  };

  mountSystemMethods(apiService);
  return apiService;
}

function mountSystemMethods(apiService: ApiService) {
  apiService.on('uiMethod', ({ componentId, name, parameters }) => {
    switch (componentId) {
      // hanlder as module event
      case GLOBAL_MODULE_ID:
        apiService.send('moduleEvent', {
          fromId: parameters.moduleId,
          eventType: name,
        });
        break;
      case GLOBAL_UTILS_ID:
        // handle as window function
        if (name in window) {
          const method = window[name as keyof Window];
          if (typeof method === 'function') {
            method(parameters);
          }
        }
        break;
    }
  });
}
