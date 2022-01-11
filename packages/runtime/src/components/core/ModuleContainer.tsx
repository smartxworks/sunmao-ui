import { implementRuntimeComponent } from '../../utils/buildKit';
import { ModuleSchema } from '../../types';
import { ModuleRenderer } from '../_internal/ModuleRenderer';

export default implementRuntimeComponent({
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
      properties: ModuleSchema,
      state: {},
      methods: {},
      slots: [],
      styleSlots: [],
      events: [],
    },
  })(({
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
  })