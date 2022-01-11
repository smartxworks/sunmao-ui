type HandlerMap = Record<string, (parameters?: any) => void>;

export type GlobalHandlerMap = Map<string, HandlerMap>;

export function initGlobalHandlerMap() {
  return new Map<string, HandlerMap>();
}
