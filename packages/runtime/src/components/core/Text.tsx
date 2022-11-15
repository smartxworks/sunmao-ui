import { Type } from '@sinclair/typebox';
import _Text, { TextPropertySpec } from '../_internal/Text';
import { implementRuntimeComponent } from '../../utils/buildKit';
import { CORE_VERSION, CoreComponentName } from '@sunmao-ui/shared';
import React from 'react';

const StateSpec = Type.Object({
  value: Type.String(),
});

const PropsSpec = Type.Object({
  value: TextPropertySpec,
});

export default implementRuntimeComponent({
  version: CORE_VERSION,
  metadata: {
    name: CoreComponentName.Text,
    displayName: 'Text',
    description: 'support plain and markdown formats',
    exampleProperties: {
      value: {
        raw: 'text',
        format: 'plain',
      },
    },
    annotations: {
      category: 'Display',
    },
    deprecated: true,
  },
  spec: {
    properties: PropsSpec,
    state: StateSpec,
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: [],
  },
})(({ value, customStyle, elementRef }) => {
  return <_Text value={value} cssStyle={customStyle?.content} ref={elementRef} />;
});
