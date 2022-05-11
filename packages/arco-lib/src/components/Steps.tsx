import { Steps as BaseSteps } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import {
  StepsPropsSpec as BaseStepsPropsSpec,
  StepItemSpec,
} from '../generated/types/Steps';

const StepsPropsSpec = Type.Object(BaseStepsPropsSpec);
const StepsStateSpec = Type.Object({});

type StepItem = Static<typeof StepItemSpec>;

const exampleProperties: Static<typeof StepsPropsSpec> = {
  type: 'default',
  size: 'default',
  direction: 'horizontal',
  status: 'finish',
  current: 2,
  lineless: false,
  items: [
    { title: 'Succeeded', description: 'This is a description' },
    { title: 'Processing', description: '' },
    { title: 'Pending', description: 'This is a description' },
  ],
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'steps',
    displayName: 'Steps',
    exampleProperties,
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: StepsPropsSpec,
    state: StepsStateSpec,
    methods: {},
    slots: {
      icons: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content'],
    events: [],
  },
};

export const Steps = implementRuntimeComponent(options)(props => {
  const { items, ...cProps } = getComponentProps(props);
  const { elementRef, customStyle, slotsElements } = props;

  const labelPlacement = cProps.direction === 'horizontal' ? 'vertical' : 'horizontal';

  return (
    <BaseSteps
      className={css(customStyle?.content)}
      {...cProps}
      ref={elementRef}
      labelPlacement={labelPlacement}
    >
      {items &&
        items.map((stepItem: StepItem, idx: number) => {
          return (
            <BaseSteps.Step
              icon={slotsElements.icons ? <slotsElements.icons /> : null}
              key={idx}
              title={stepItem.title}
              description={stepItem.description}
            />
          );
        })}
    </BaseSteps>
  );
});
