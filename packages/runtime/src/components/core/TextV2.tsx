import { Type } from '@sinclair/typebox';
import {
  CORE_VERSION_V2,
  CoreComponentName,
  PRESET_PROPERTY_CATEGORY,
} from '@sunmao-ui/shared';
import React from 'react';
import { css } from '@emotion/css';
import { implementRuntimeComponent } from '../../utils/buildKit';

export default implementRuntimeComponent({
  version: CORE_VERSION_V2,
  metadata: {
    name: CoreComponentName.Text,
    displayName: 'Text',
    description: 'Plain Text',
    exampleProperties: { text: 'Hello, Sunmao!' },
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: Type.Object({
      text: Type.String({
        title: 'Text',
        category: PRESET_PROPERTY_CATEGORY.Basic,
      }),
    }),
    state: Type.Object({}),
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: [],
  },
})(({ text, customStyle, elementRef }) => {
  return (
    <span
      className={css`
        ${customStyle?.content}
      `}
      ref={elementRef}
    >
      {text}
    </span>
  );
});
