type HandlerMap = Record<string, (parameters?: any) => void>;

export const globalHandlerMap = new Map<string, HandlerMap>();
