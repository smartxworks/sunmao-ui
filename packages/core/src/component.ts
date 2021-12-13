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
  return (
    { 
      version: options.version,
      kind: ('Component' as any),
      parsedVersion: parseVersion(options.version),
      metadata: {
        description: '',
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
    }
  );
}
