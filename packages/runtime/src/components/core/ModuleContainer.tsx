import { implementRuntimeComponent } from '../../utils/buildKit';
import { ModuleSpec, CORE_VERSION, CoreComponentName } from '@sunmao-ui/shared';
import { ModuleRenderer } from '../_internal/ModuleRenderer';

export default implementRuntimeComponent({
  version: CORE_VERSION,
  metadata: {
    name: CoreComponentName.ModuleContainer,
    displayName: 'ModuleContainer',
    description: 'ModuleContainer component',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {
      id: 'myModule',
      type: 'custom/v1/module',
    },
    exampleSize: [6, 6],
    annotations: {
      category: 'Advance',
    },
  },
  spec: {
    properties: ModuleSpec,
    state: {},
    methods: {},
    slots: [],
    styleSlots: [],
    events: [],
  },
})(({ id, type, properties, handlers, services, app, elementRef }) => {
  if (!type) {
    return <span ref={elementRef}>Please choose a module to render.</span>;
  }
  if (!id) {
    return <span ref={elementRef}>Please set a id for module.</span>;
  }

  return (
    <ModuleRenderer
      id={id}
      type={type}
      properties={properties}
      handlers={handlers}
      services={services}
      app={app}
      ref={elementRef}
    />
  );
});
