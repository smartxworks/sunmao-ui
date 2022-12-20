import * as Icons from '@arco-design/web-react/icon';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css, cx } from '@emotion/css';
import { Type } from '@sinclair/typebox';
import { FALLBACK_METADATA } from '../sunmao-helper';

const IconPropsSpec = Type.Object({
  name: Type.KeyOf(Type.Object(Icons as Record<keyof typeof Icons, any>), {
    title: 'Name',
    widget: 'arco/v1/icon',
  }),
  spin: Type.Boolean({
    title: 'Spin',
  }),
});

export const Icon = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'icon',
    displayName: 'Icon',
    exampleProperties: {
      name: 'IconArrowUp',
      spin: false,
    },
    annotations: {
      category: 'General',
    },
  },
  spec: {
    properties: IconPropsSpec,
    state: Type.Object({}),
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: ['event'],
  },
})(props => {
  const { elementRef, name, spin, customStyle } = props;
  const _Icon = Icons[name];

  return <_Icon ref={elementRef} className={cx(css(customStyle?.content))} spin={spin} />;
});
