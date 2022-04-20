import { implementRuntimeComponent } from '../../utils/buildKit';
// import { useEffect } from 'react';
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
})(() => {
  // console.info('####Component Render', component.id);
  // useEffect(() => {
  //   console.info('####Component DidMount', component.id);
  //   componentDidMount?.forEach(e => e());
  // }, [component.id, componentDidMount]);
  // useEffect(() => {
  //   console.info('####Component Update', component.id);
  //   componentDidUpdate?.forEach(e => e());
  // }, [component.id, componentDidMount, componentDidUpdate]);
  // useEffect(() => {
  //   return () => {
  //     console.info('Component DidUnmount', component.id, unmountHooks);
  //     unmountHooks?.forEach(e => e());
  //   };
  // }, [component.id, unmountHooks]);

  return null;
});
