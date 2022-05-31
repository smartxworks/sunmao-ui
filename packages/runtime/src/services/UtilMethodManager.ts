import { GLOBAL_MODULE_ID, GLOBAL_UTIL_METHOD_ID } from '../constants';
import { ApiService } from './apiService';
import { ImplementedUtilMethod, UIServices } from '../types';

export class UtilMethodManager {
  constructor(private apiService: ApiService) {
    this.listenSystemMethods();
  }

  listenUtilMethod<T>(utilMethod: ImplementedUtilMethod<T>, services: UIServices) {
    this.apiService.on('uiMethod', ({ componentId, name, parameters }) => {
      if (
        componentId === GLOBAL_UTIL_METHOD_ID &&
        name === `${utilMethod.version}/${utilMethod.metadata.name}`
      ) {
        utilMethod.impl(parameters, services);
      }
    });
  }

  private listenSystemMethods() {
    this.apiService.on('uiMethod', ({ componentId, name, parameters }) => {
      switch (componentId) {
        // handler as module event
        case GLOBAL_MODULE_ID:
          this.apiService.send('moduleEvent', {
            fromId: parameters.moduleId,
            eventType: name,
          });
          break;
        case GLOBAL_UTIL_METHOD_ID:
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
}
