import { implementRuntimeComponent } from '../../utils/buildKit';
import {
  ModuleRenderSpec,
  CORE_VERSION,
  CoreComponentName,
  isEventTrait,
  EventHandlerSpec,
} from '@sunmao-ui/shared';
import { ModuleRenderer } from '../_internal/ModuleRenderer';
import React, { useMemo } from 'react';
import { css } from '@emotion/css';
import { Static } from '@sinclair/typebox';

export default implementRuntimeComponent({
  version: CORE_VERSION,
  metadata: {
    name: CoreComponentName.ModuleContainer,
    displayName: 'ModuleContainer',
    description: 'ModuleContainer component',
    exampleProperties: {
      id: 'myModule',
      type: 'custom/v1/myModule0',
      properties: {},
      handlers: [],
    },
    annotations: {
      category: 'Advance',
    },
  },
  spec: {
    properties: ModuleRenderSpec,
    state: {},
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: [],
  },
})(
  ({
    component,
    id,
    type,
    properties,
    handlers,
    services,
    app,
    elementRef,
    customStyle,
  }) => {
    if (!type) {
      return <span ref={elementRef}>Please choose a module to render.</span>;
    }
    if (!id) {
      return <span ref={elementRef}>Please set a id for module.</span>;
    }

    const totalHandlers = useMemo(() => {
      const eventTrait = component.traits.find(t => isEventTrait(t));

      if (!eventTrait) return handlers;

      return [
        ...handlers,
        ...(eventTrait.properties.handlers as Static<typeof EventHandlerSpec>[]),
      ];
    }, [component.traits, handlers]);

    return (
      <ModuleRenderer
        id={id}
        className={css`
          ${customStyle?.content}
        `}
        type={type}
        properties={properties}
        handlers={totalHandlers}
        services={services}
        app={app}
        ref={elementRef}
        containerId={component.id}
      />
    );
  }
);
