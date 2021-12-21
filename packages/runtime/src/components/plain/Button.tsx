import { useEffect, useRef } from 'react';
import {
  createComponent2,
  CreateComponentOptions2,
  RuntimeComponentSpec2,
} from '@sunmao-ui/core';
import { Type, Static } from '@sinclair/typebox';
import Text, { TextPropertySchema } from '../_internal/Text';
import { ComponentImplementation } from '../../services/registry';

export type ImplementedRuntimeComponent2<K1, K2, K3> = RuntimeComponentSpec2<
  string,
  K1,
  K2,
  K3
> & {
  impl: ComponentImplementation;
};

function implementRuntimeComponent<
  K extends string,
  K1 extends string,
  K2 extends string,
  K3 extends string,
  T extends CreateComponentOptions2<K, K1, K2, K3>
>(
  options: T
): (
  impl: ComponentImplementation<
    Static<T['spec']['properties']>,
    Static<T['spec']['state']>,
    ToMap<T['spec']['methods']>,
    ToStringUnion<T['spec']['slots']>,
    ToStringUnion<T['spec']['styleSlots']>,
    ToStringUnion<T['spec']['events']>
  >
) => ImplementedRuntimeComponent2<K1, K2, K3> {
  return impl => ({
    ...createComponent2(options),
    impl,
  });
}

type ToMap<U> = {
  [K in keyof U]: Static<U[K]>;
};

type ToStringUnion<T extends ReadonlyArray<string>> = T[number];

const StateSchema = Type.Object({
  value: Type.String(),
});

const PropsSchema = Type.Object({
  text: TextPropertySchema,
});

export type ArrayItem<T extends readonly unknown[]> = T extends readonly (infer U)[]
  ? U
  : never;

export default implementRuntimeComponent(
  // T start
  {
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
      state: Type.Object({
        value: Type.String(),
        foo: Type.Boolean(),
      }),
      methods: {
        click: Type.Object({
          force: Type.Boolean(),
        }),
        dblClick: Type.Boolean(),
      },
      slots: ['prefix', 'suffix'],
      styleSlots: ['wrapper', 'inner'],
      events: ['onBlur'],
    },
  }
  // T end
)(({ text, mergeState, subscribeMethods, callbackMap, customStyle, slotsMap, Slot }) => {
  useEffect(() => {
    // merget state
    mergeState({
      value: text.raw,
      foo: false,
    });
  }, [text.raw]);

  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    // subscribe methods
    subscribeMethods({
      click(params) {
        console.log(params.force);
      },
      dblClick() {
        //
      },
    });
  }, []);

  return (
    <button
      ref={ref}
      css={`
        ${customStyle?.inner}
      `}
      onClick={callbackMap?.onBlur}
    >
      <Slot slotsMap={slotsMap} slot="prefix" />
      <Text value={text} />
      <Slot slotsMap={slotsMap} slot="suffix" />
    </button>
  );
});
