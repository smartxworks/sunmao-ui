type HandlerMap = Record<string, (parameters?: any) => void>;

export type GlobalHandlerMap = ReturnType<typeof initGlobalHandlerMap>;

export function initGlobalHandlerMap() {
  return new Map<string, HandlerMap>();
}
