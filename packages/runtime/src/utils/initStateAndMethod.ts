import { RuntimeApplication } from '@sunmao-ui/core';
import { Static, TSchema } from '@sinclair/typebox';
import { Registry } from '../services/Registry';
import { StateManagerInterface } from '../services/StateManager';
import {
  ModuleSpec,
  parseTypeBox,
  CORE_VERSION,
  MODULE_CONTAINER_COMPONENT_NAME,
} from '@sunmao-ui/shared';

export function initStateAndMethod(
  registry: Registry,
  stateManager: StateManagerInterface,
  components: RuntimeApplication['spec']['components']
) {
  components.forEach(c => {
    if (stateManager.store[c.id]) {
      return false;
    }
    let state = {};
    c.traits.forEach(t => {
      const tSpec = registry.getTrait(t.parsedType.version, t.parsedType.name).spec;
      state = { ...state, ...parseTypeBox(tSpec.state as TSchema) };
    });
    const cSpec = registry.getComponent(c.parsedType.version, c.parsedType.name).spec;
    state = { ...state, ...parseTypeBox(cSpec.state as TSchema) };

    stateManager.store[c.id] = state;

    if (c.type === `${CORE_VERSION}/${MODULE_CONTAINER_COMPONENT_NAME}`) {
      const moduleSchema = c.properties as Static<typeof ModuleSpec>;
      try {
        const mSpec = registry.getModuleByType(moduleSchema.type).spec;
        const moduleInitState: Record<string, unknown> = {};
        for (const key in mSpec) {
          moduleInitState[key] = undefined;
        }
        stateManager.store[moduleSchema.id] = moduleInitState;
      } catch {}
    }
  });
}
