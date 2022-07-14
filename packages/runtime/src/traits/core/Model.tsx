import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION } from '@sunmao-ui/shared';
import { set } from 'lodash';

const ModelTraitPropertiesSpec = Type.Object({
  value: Type.String({
    title: 'Value',
  }),
});
const ModelTraitStateSpec = Type.Object({});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: 'model',
    description: '',
  },
  spec: {
    properties: ModelTraitPropertiesSpec,
    methods: [],
    state: ModelTraitStateSpec,
  },
})(() => {
  return ({ trait, value, component, services }) => {
    const { registry, stateManager } = services;
    const { store } = stateManager;
    const spec = registry.getComponentByType(component.type);

    if (spec.spec.model) {
      const { model } = spec.spec;
      const rawValue = trait.properties.value;
      const callbackMap = model.events.reduce(
        (map: Record<string, () => void>, event) => {
          map[event] = () => {
            const pathStr = rawValue.replace(/[{}\s]/g, '');
            const [targetComponentId, ...path] = pathStr.split('.');

            if (targetComponentId && store[targetComponentId]) {
              set(
                store[targetComponentId],
                path.join('.'),
                store[component.id][model.state]
              );
            }
          };

          return map;
        },
        {}
      );

      store[component.id][model.state] = value;

      return {
        props: {
          [model.prop]: value,
          callbackMap,
        },
      };
    }

    return {
      props: {},
    };
  };
});
