import { Progress as BaseProgress } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { ProgressPropsSpec as BaseProgressPropsSpec } from '../generated/types/Progress';

const ProgressPropsSpec = Type.Object(BaseProgressPropsSpec);
const ProgressStateSpec = Type.Object({});

const exampleProperties: Static<typeof ProgressPropsSpec> = {
  type: 'line',
  status: 'normal',
  color: '#3c92dc',
  trailColor: '',
  showText: true,
  percent: 20,
  width: 100,
  size: 'default',
  animation: false,
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'progress',
    displayName: 'Progress',
    exampleProperties,
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: ProgressPropsSpec,
    state: ProgressStateSpec,
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: [],
  },
};

export const Progress = implementRuntimeComponent(options)(props => {
  const { color, ...cProps } = getComponentProps(props);
  const { customStyle, elementRef } = props;

  return (
    <BaseProgress
      ref={elementRef}
      color={cProps.status === 'normal' ? color : ''}
      className={css(customStyle?.content)}
      {...cProps}
    />
  );
});
