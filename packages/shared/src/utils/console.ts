enum ConsoleLevel {
  Log = 'log',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}
export enum ConsoleType {
  Expression = 'expression',
  Component = 'component',
  Trait = 'trait',
  Reactivity = 'reactivity',
}

function consoleByLevel(
  level: ConsoleLevel,
  type: ConsoleType,
  scope: string,
  message: string
) {
  console[level](`[Sunmao ${type}]${scope ? `(${scope})` : ''}: ${message}`);
}

export function consoleLog(type: ConsoleType, scope: string, message: string) {
  consoleByLevel(ConsoleLevel.Log, type, scope, message);
}

export function consoleInfo(type: ConsoleType, scope: string, message: string) {
  consoleByLevel(ConsoleLevel.Info, type, scope, message);
}

export function consoleWarn(type: ConsoleType, scope: string, message: string) {
  consoleByLevel(ConsoleLevel.Warn, type, scope, message);
}

export function consoleError(type: ConsoleType, scope: string, message: string) {
  consoleByLevel(ConsoleLevel.Error, type, scope, message);
}
