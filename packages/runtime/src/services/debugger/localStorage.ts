import type { DebugLog } from './type';
type DebugInfo = {
  state: Record<string, any>;
  debugLogs: DebugLog[];
};

const getDebugInfo = (key: string): DebugInfo | null => {
  try {
    const debugInfoStr = localStorage.getItem(key);
    return debugInfoStr ? JSON.parse(debugInfoStr) : null;
  } catch {
    return null;
  }
};

const setDebugInfo = (key: string, debugInfo: DebugInfo) => {
  localStorage.setItem(key, JSON.stringify(debugInfo));
};

export const saveDebugInfoToLocalstorage = (
  message: DebugLog,
  state: Record<string, any>,
  key = 'sunmao-debug-info'
) => {
  const debugInfo = getDebugInfo(key) || { state: {}, debugLogs: [] };
  debugInfo.state = state;
  debugInfo.debugLogs.push(message);
  setDebugInfo(key, debugInfo);
};
