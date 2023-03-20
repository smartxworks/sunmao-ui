import { DebugLoggerType } from './const';
const getDate = () => {
  return new Date().toLocaleTimeString();
};

type Param = {
  type: DebugLoggerType;
  [k: string]: any;
};

export const print = (params: Param, state?: any) => {
  const { type, ...restParams } = params;
  switch (type) {
    case DebugLoggerType.MERGE_STATE:
      console.debug(`%c[${getDate()}]${type}`, 'color:#105D1A;', restParams);
      if (state) {
        console.debug(`%c[All current state]`, 'color:#105D1A;', state);
      }
      break;
    case DebugLoggerType.TRIGGER_EVENT:
      console.debug(`%c[${getDate()}]${type}`, 'color:#EEB422;', restParams);
      break;
    default:
      console.debug(`%c[${getDate()}]${type}`, 'color:#105D1A;', restParams);
      break;
  }
};
