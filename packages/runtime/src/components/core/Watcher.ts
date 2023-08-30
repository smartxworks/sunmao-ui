import { Type } from '@sinclair/typebox';
import {
  CORE_VERSION_V2,
  CoreComponentName,
  PRESET_PROPERTY_CATEGORY,
} from '@sunmao-ui/shared';
import { implementRuntimeComponent } from '../../utils/buildKit';
import { useEffect } from 'react';

export default implementRuntimeComponent({
  version: CORE_VERSION_V2,
  metadata: {
    name: CoreComponentName.Watcher,
    displayName: 'Watcher',
    description: 'Watch expression changing and trigger events',
    exampleProperties: { value: '' },
    isDataSource: true,
    annotations: {
      category: 'Data',
    },
  },
  spec: {
    properties: Type.Object({
      value: Type.String({
        title: 'Value',
        category: PRESET_PROPERTY_CATEGORY.Basic,
      }),
    }),
    state: Type.Object({ value: Type.Any() }),
    methods: {},
    slots: {},
    styleSlots: [],
    events: ['onChange'],
  },
})(({ value, mergeState, callbackMap }) => {
  useEffect(() => {
    mergeState({ value });
    callbackMap?.onChange();
  }, [callbackMap, mergeState, value]);

  return null;
});
