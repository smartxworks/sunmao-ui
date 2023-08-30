export const CORE_VERSION = 'core/v1';
export const CORE_VERSION_V2 = 'core/v2';
export declare const STYLE_VERSION = 'style/v1';
// core components
export enum CoreComponentName {
  Dummy = 'dummy',
  ModuleContainer = 'moduleContainer',
  Text = 'text',
  Iframe = 'iframe',
  Watcher = 'watcher',
}
// core traits
export enum CoreTraitName {
  Fetch = 'fetch',
  Event = 'event',
  Style = 'style',
  ArrayState = 'arrayState',
  Hidden = 'hidden',
  LocalStorage = 'localStorage',
  State = 'state',
  Slot = 'slot',
  Validation = 'validation',
  Transformer = 'transformer',
}
// core widgets
export enum CoreWidgetName {
  Event = 'event',
  ArrayField = 'array',
  BooleanField = 'boolean',
  Category = 'category',
  Expression = 'expression',
  Module = 'module',
  MultiField = 'multi',
  NullField = 'null',
  NumberField = 'number',
  ObjectField = 'object',
  Popover = 'popover',
  RecordField = 'record',
  Spec = 'spec',
  StringField = 'string',
  UnsupportedField = 'unsupported',
  Breadcrumb = 'breadcrumb',
}

export enum StyleWidgetName {
  Size = 'size',
  Color = 'color',
  Font = 'font',
  Space = 'space',
}

export enum MountEvent {
  mount = '$onMount',
  unmount = '$onUnmount',
  update = '$onUpdate',
}

export const MountEvents = [MountEvent.mount, MountEvent.unmount, MountEvent.update];
