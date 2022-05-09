import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui/shared';

const ContainerSpec = Type.Object({
  id: Type.String(),
  slot: Type.String(),
});

export const SlotTraitPropertiesSpec = Type.Object({
  container: ContainerSpec,
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: CoreTraitName.Slot,
    description: 'nested components by slots',
  },
  spec: {
    properties: SlotTraitPropertiesSpec,
    state: {},
    methods: [],
  },
})(() => () => ({
  props: null,
}));
