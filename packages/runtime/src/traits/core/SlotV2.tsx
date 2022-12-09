import { Type } from '@sinclair/typebox';
import { CoreTraitName } from '@sunmao-ui/shared';
import { implementRuntimeTrait } from '../../utils/buildKit';

const ContainerPropertySpec = Type.Object(
  {
    id: Type.String({ isComponentId: true }),
    slot: Type.String(),
  },
  // don't show this property in the editor
  { widgetOptions: { isHidden: true } }
);

export const PropsSpec = Type.Object({
  container: ContainerPropertySpec,
  ifCondition: Type.Boolean(),
});

export default implementRuntimeTrait({
  version: 'core/v2',
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
    unmount: !ifCondition,
  });
});
