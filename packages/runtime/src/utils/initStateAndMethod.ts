import { RuntimeApplication } from '@meta-ui/core';
import { TSchema } from '@sinclair/typebox';
import { registry } from '../registry';
import { stateStore } from '../store';
import { parseTypeBox } from './parseTypeBox';

export function initStateAndMethod(
  components: RuntimeApplication['spec']['components']
) {
  components.forEach(c => {
    if (stateStore[c.id]) {
      return false;
    }
    let state = {};
    c.traits.forEach(t => {
      const tSpec = registry.getTrait(
        t.parsedType.version,
        t.parsedType.name
      ).spec;
      state = { ...state, ...parseTypeBox(tSpec.state as TSchema) };
    });
    const cSpec = registry.getComponent(
      c.parsedType.version,
      c.parsedType.name
    ).spec;
    state = { ...state, ...parseTypeBox(cSpec.state as TSchema) };
    stateStore[c.id] = state;
  });
}
