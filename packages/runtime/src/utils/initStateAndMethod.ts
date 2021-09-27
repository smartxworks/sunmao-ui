import { RuntimeApplication } from '@meta-ui/core';
import { TSchema } from '@sinclair/typebox';
import { Registry } from 'src/modules/registry';
import { StateManager } from 'src/modules/stateStore';
import { parseTypeBox } from './parseTypeBox';

export function initStateAndMethod(
  registry: Registry,
  stateManager: StateManager,
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
  });
}
