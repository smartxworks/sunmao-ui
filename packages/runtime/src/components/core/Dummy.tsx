import { implementRuntimeComponent } from '../../utils/buildKit';
import { useEffect } from 'react';
import { Type } from '@sinclair/typebox';

export default implementRuntimeComponent({
  version: 'core/v1',
  metadata: {
    name: 'dummy',
    displayName: 'Dummy',
    description: 'Dummy Invisible component',
    isDraggable: false,
    isResizable: false,
    exampleProperties: {},
    exampleSize: [1, 1],
    annotations: {
      category: 'Advance',
    },
  },
  spec: {
    properties: Type.Object({}),
    state: Type.Object({}),
    methods: {},
    slots: [],
    styleSlots: [],
    events: [],
  },
})(({ effects, component, data }) => {
  console.info('####Component Render', component.id);
  useEffect(() => {
    console.info('####Component DidMount', component.id);
    (data as any).didMount();
  }, [component.id, data]);
  useEffect(() => {
    console.info('####Component Update By Effects', component.id, effects);
    return () => {
      console.info('####Component DidUnmount', component.id, effects);
      effects?.forEach(e => e());
    };
  }, [component.id, effects]);

  return null;
});
