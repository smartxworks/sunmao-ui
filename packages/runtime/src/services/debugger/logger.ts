import { DebugLoggerType } from './const';
import type { DebugLog } from './type';
const getDate = () => {
  return new Date().toLocaleTimeString();
};

export const printDebugInfo = (log: DebugLog, state?: Record<string, any>) => {
  const { type, ...restParams } = log;
  switch (type) {
    case DebugLoggerType.MERGE_STATE:
      console.debug(`%c[${getDate()}]${type}`, 'color:#105D1A;', restParams);
      if (state) {
        console.debug(`%c[All current state]`, 'color:#105D1A;', state);
      }
      break;
    case DebugLoggerType.MODULE_EVENT:
    case DebugLoggerType.TRIGGER_EVENT:
      console.debug(`%c[${getDate()}]${type}`, 'color:#EEB422;', restParams);
      break;
    default:
      console.debug(`%c[${getDate()}]${type}`, 'color:#105D1A;', restParams);
      break;
  }
};
