import { createComponent } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { ComponentImplementation } from '../../services/registry';
import { RuntimeModuleSchema } from '../../types/RuntimeSchema';
import { ModuleRenderer } from '../_internal/ModuleRenderer';

type Props = Static<typeof RuntimeModuleSchema>;

const ModuleContainer: ComponentImplementation<Props> = ({
  id,
  type,
  properties,
  handlers,
  services,
  app
}) => {
  if (!type) {
    return <span>Please choose a module to render.</span>
  }
  if (!id) {
    return <span>Please set a id for module.</span>
  }

  return (
    <ModuleRenderer
      id={id}
      type={type}
      properties={properties}
      handlers={handlers}
      services={services}
      app={app}
    />
  );
};

export default {
  ...createComponent({
    version: 'core/v1',
    metadata: {
      name: 'moduleContainer',
      displayName: 'ModuleContainer',
      description: 'ModuleContainer component',
      isDraggable: true,
      isResizable: true,
      exampleProperties: {
        id: 'myModule',
        type: 'custom/v1/module',
      },
      exampleSize: [6, 6],
    },
    spec: {
      properties: Type.Object({
        id: Type.String(),
        type: Type.String(),
        properties: Type.Record(Type.String(), Type.Any()),
      }),
      state: {},
      methods: [],
      slots: [],
      styleSlots: [],
      events: [],
    },
  }),
  impl: ModuleContainer,
};
