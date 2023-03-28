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
    debugHandler?.onDebug(
      {
        type: DebugLoggerType.MERGE_STATE,
        ...params,
      },
      stateManager.store
    );
  });
  services.on('uiMethod', params => {
    debugHandler?.onDebug(
      {
        type: DebugLoggerType.TRIGGER_EVENT,
        ...params,
      },
      stateManager.store
    );
  });

  services.on('moduleEvent', params => {
    debugHandler?.onDebug(
      {
        type: DebugLoggerType.MODULE_EVENT,
        ...params,
      },
      stateManager.store
    );
  });
};
