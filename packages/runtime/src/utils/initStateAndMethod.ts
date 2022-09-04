import { RuntimeComponentSchema } from '@sunmao-ui/core';
import { Static } from '@sinclair/typebox';
import { RegistryInterface } from '../services/Registry';
import { StateManagerInterface } from '../services/StateManager';
import {
  ModuleRenderSpec,
  generateDefaultValueFromSpec,
  CORE_VERSION,
  CoreComponentName,
} from '@sunmao-ui/shared';
import { JSONSchema7Object } from 'json-schema';

export function initStateAndMethod(
  registry: RegistryInterface,
  stateManager: StateManagerInterface,
  components: RuntimeComponentSchema[]
) {
  components.forEach(c => {
    const inited = initSingleComponentState(registry, stateManager, c);
    if (inited) {
      stateManager.initSet.add(c.id);
    }
  });
}

export function initSingleComponentState(
  registry: RegistryInterface,
  stateManager: StateManagerInterface,
  c: RuntimeComponentSchema
): boolean {
  if (stateManager.store[c.id]) {
    return false;
  }

  let state = {};
  c.traits.forEach(t => {
    const tSpec = registry.getTrait(t.parsedType.version, t.parsedType.name).spec;
    state = {
      ...state,
      ...(generateDefaultValueFromSpec(tSpec.state) as JSONSchema7Object),
    };
  });
  const cSpec = registry.getComponent(c.parsedType.version, c.parsedType.name).spec;
  state = {
    ...state,
    ...(generateDefaultValueFromSpec(cSpec.state) as JSONSchema7Object),
  };

  stateManager.store[c.id] = state;

  if (c.type === `${CORE_VERSION}/${CoreComponentName.ModuleContainer}`) {
    const moduleSchema = c.properties as Static<typeof ModuleRenderSpec>;
    try {
      const mSpec = registry.getModuleByType(moduleSchema.type).spec;
      const moduleInitState: Record<string, unknown> = {};
      for (const key in mSpec) {
        moduleInitState[key] = undefined;
      }
      stateManager.store[moduleSchema.id] = moduleInitState;
    } catch {}
  }

  return true;
}
