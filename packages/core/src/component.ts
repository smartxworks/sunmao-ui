import { JSONSchema7 } from 'json-schema';
import { parseVersion, Version } from './version';
import { ComponentMetadata } from './metadata';
import { MethodSchema } from './method';

type ComponentSpec<
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

export type Component<
  KMethodName extends string,
  KStyleSlot extends string,
  KSlot extends string,
  KEvent extends string
> = {
  version: string;
  kind: 'Component';
  metadata: ComponentMetadata;
  spec: ComponentSpec<KMethodName, KStyleSlot, KSlot, KEvent>;
};

export type RuntimeComponent<
  KMethodName extends string,
  KStyleSlot extends string,
  KSlot extends string,
  KEvent extends string
> = Component<KMethodName, KStyleSlot, KSlot, KEvent> & {
  parsedVersion: Version;
};

export type CreateComponentOptions<
  KMethodName extends string,
  KStyleSlot extends string,
  KSlot extends string,
  KEvent extends string
> = Omit<Component<KMethodName, KStyleSlot, KSlot, KEvent>, 'kind'>;

export function createComponent<
  KMethodName extends string,
  KStyleSlot extends string,
  KSlot extends string,
  KEvent extends string
>(
  options: CreateComponentOptions<KMethodName, KStyleSlot, KSlot, KEvent>
): RuntimeComponent<KMethodName, KStyleSlot, KSlot, KEvent> {
  return {
    ...options,
    kind: 'Component',
    parsedVersion: parseVersion(options.version),
  };
}
