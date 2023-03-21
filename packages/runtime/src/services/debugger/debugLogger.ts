import { ApiService } from '../apiService';
import { StateManager } from '../StateManager';
import { DebugLoggerType } from './const';
import type { DebuggerHandler } from './type';

export const debugLogger = (
  services: ApiService,
  stateManager: StateManager,
  debugHandler?: DebuggerHandler
) => {
  services.on('mergeState', params => {
    debugHandler?.onDebug(stateManager.store, {
      type: DebugLoggerType.TRIGGER_EVENT,
      ...params,
    });
  });
  services.on('uiMethod', params => {
    debugHandler?.onDebug(stateManager.store, {
      type: DebugLoggerType.TRIGGER_EVENT,
      ...params,
    });
  });

  services.on('moduleEvent', params => {
    debugHandler?.onDebug(stateManager.store, {
      type: DebugLoggerType.MODULE_EVENT,
      ...params,
    });
  });
};
