import { Type } from '@sinclair/typebox';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui/shared';
import { implementRuntimeTrait } from 'src/utils/buildKit';

const ContainerPropertySpec = Type.Object({
  id: Type.String(),
  slot: Type.String(),
});

export const PropsSpec = Type.Object({
  container: ContainerPropertySpec,
  ifCondition: Type.Optional(Type.Boolean()),
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: CoreTraitName.Slot,
    description: 'nested components by slots',
    annotations: {
      beforeRender: true,
    },
  },
  spec: {
    properties: PropsSpec,
    state: Type.Object({}),
    methods: [],
  },
})(() => {
  return ({ ifCondition }) => ({
    props: null,
    unmount: ifCondition === false,
  });
});
