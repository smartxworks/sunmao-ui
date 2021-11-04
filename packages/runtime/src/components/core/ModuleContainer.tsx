import { createComponent } from '@meta-ui/core';
import { Static } from '@sinclair/typebox';
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
  app,
}) => {
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
      exampleProperties: {},
      exampleSize: [6, 6],
    },
    spec: {
      properties: {},
      state: {},
      methods: [],
      slots: [],
      styleSlots: [],
      events: [],
    },
  }),
  impl: ModuleContainer,
};
