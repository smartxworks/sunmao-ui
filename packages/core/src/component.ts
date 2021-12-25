import { JSONSchema7 } from 'json-schema';
import { parseVersion } from './version';
import { ComponentMetadata } from './metadata';
import { MethodSchema } from './method';
import { Version } from './version';

// spec

export type Component = {
  version: string;
  kind: 'Component';
  metadata: ComponentMetadata;
  spec: ComponentSpec;
};

type ComponentSpec = {
  properties: JSONSchema7;
  state: JSONSchema7;
  methods: MethodSchema[];
  styleSlots: string[];
  slots: string[];
  events: string[];
};

// extended runtime
export type RuntimeComponentSpec = Component & {
  parsedVersion: Version;
};

// partial some fields, use as param createComponent
export type ComponentDefinition = {
  version: string;
  metadata: Partial<ComponentMetadata> & { name: string };
  spec?: Partial<ComponentSpec>;
};

export function createComponent(options: ComponentDefinition): RuntimeComponentSpec {
  return {
    version: options.version,
    kind: 'Component' as any,
    parsedVersion: parseVersion(options.version),
    metadata: {
      description: options.metadata.description || '',
      isDraggable: true,
      isResizable: true,
      displayName: options.metadata.name,
      exampleProperties: {},
      exampleSize: [1, 1],
      ...options.metadata,
    },
    spec: {
      properties: {},
      state: {},
      methods: [],
      styleSlots: [],
      slots: [],
      events: [],
      ...options.spec,
    },
  };
}

// TODO: (type-safe), rename version 2 to normal version

type ComponentSpec2<
  KMethodName extends string,
  KStyleSlot extends string,
  KSlot extends string,
  KEvent extends string
> = {
  properties: JSONSchema7;
  state: JSONSchema7;
  methods: Record<KMethodName, MethodSchema['parameters']>;
  styleSlots: ReadonlyArray<KStyleSlot>;
  slots: ReadonlyArray<KSlot>;
  events: ReadonlyArray<KEvent>;
};

export type Component2<
  KMethodName extends string,
  KStyleSlot extends string,
  KSlot extends string,
  KEvent extends string
> = {
  version: string;
  kind: 'Component';
  metadata: ComponentMetadata;
  spec: ComponentSpec2<KMethodName, KStyleSlot, KSlot, KEvent>;
};

export type RuntimeComponentSpec2<
  KMethodName extends string,
  KStyleSlot extends string,
  KSlot extends string,
  KEvent extends string
> = Component2<KMethodName, KStyleSlot, KSlot, KEvent> & {
  parsedVersion: Version;
};

export type CreateComponentOptions2<
  KMethodName extends string,
  KStyleSlot extends string,
  KSlot extends string,
  KEvent extends string
> = Omit<Component2<KMethodName, KStyleSlot, KSlot, KEvent>, 'kind'>;

export function createComponent2<
  KMethodName extends string,
  KStyleSlot extends string,
  KSlot extends string,
  KEvent extends string
>(
  options: CreateComponentOptions2<KMethodName, KStyleSlot, KSlot, KEvent>
): RuntimeComponentSpec2<KMethodName, KStyleSlot, KSlot, KEvent> {
  return {
    ...options,
    kind: 'Component',
    parsedVersion: parseVersion(options.version),
  };
}
