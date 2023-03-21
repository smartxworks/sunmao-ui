import { DebugLoggerType } from './const';

export type DebugLog = {
  type: DebugLoggerType;
  [k: string]: any;
};

export type DebuggerHandler = {
  onDebug: (currentState: Record<string, any>, debugLog: DebugLog) => void;
};
