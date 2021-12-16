import { useEffect, useRef } from 'react';
import { createComponent } from '@sunmao-ui/core';
import { Type, Static } from '@sinclair/typebox';
import Text, { TextPropertySchema } from '../_internal/Text';
import { ComponentImplementation } from '../../services/registry';

const Button: ComponentImplementation<Static<typeof PropsSchema>> = ({
  text,
  mergeState,
  subscribeMethods,
  callbackMap,
  customStyle
}) => {
  useEffect(() => {
    mergeState({ value: text.raw });
  }, [text.raw]);

  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    subscribeMethods({
      click() {
        ref.current?.click();
      },
    });
  }, []);

  return (
    <button ref={ref} onClick={callbackMap?.onClick} className={`${customStyle?.content}`}>
      <Text value={text} />
    </button>
  );
};

const StateSchema = Type.Object({
  value: Type.String(),
});

const PropsSchema = Type.Object({
  text: TextPropertySchema,
});

export default {
  ...createComponent({
    version: 'plain/v1',
    metadata: {
      name: 'button',
      displayName: 'Button',
      description: 'plain button',
      isDraggable: true,
      isResizable: true,
      exampleProperties: {
        text: {
          raw: 'text',
          format: 'plain',
        },
      },
      exampleSize: [2, 1],
    },
    spec: {
      properties: PropsSchema,
      state: StateSchema,
      methods: [
        {
          name: 'click',
        },
      ],
      slots: [],
      styleSlots: ['content'],
      events: ['onClick'],
    },
  }),
  impl: Button,
};
