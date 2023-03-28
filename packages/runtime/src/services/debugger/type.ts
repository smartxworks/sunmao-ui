import { DebugLoggerType } from './const';

export type DebugLog = {
  type: DebugLoggerType;
  [k: string]: any;
};

export type DebuggerHandler = {
  onDebug: (debugLog: DebugLog, currentState: Record<string, any>) => void;
};
