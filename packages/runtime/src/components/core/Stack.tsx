import { implementRuntimeComponent } from '../../utils/buildKit';
import React, { ReactNode } from 'react';
import { css, CSSObject } from '@emotion/css';
import { Static, Type } from '@sinclair/typebox';
import { StringUnion, CORE_VERSION } from '@sunmao-ui/shared';

export const StackPropertySpec = Type.Object({
  align: StringUnion(
    ['flex-start', 'flex-end', 'center', 'baseline', 'stretch', 'auto'],
    {
      title: 'Align',
      category: 'Layout',
      description: 'Vertical alignment, same as css align-items',
    }
  ),
  direction: StringUnion(['vertical', 'horizontal'], {
    title: 'Direction',
    category: 'Layout',
  }),
  justify: StringUnion(
    ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
    {
      title: 'Justify',
      category: 'Layout',
      description: 'Horizontal alignment, same as css justify-content',
    }
  ),
  spacing: Type.Number({
    title: 'Spacing',
    category: 'Layout',
  }),
  wrap: Type.Boolean({
    title: 'Wrap',
    category: 'Layout',
    description: 'Auto wrap line, when horizontal effective',
  }),
});

const StateSpec = Type.Object({});

export type StackProps = Static<typeof StackPropertySpec> & {
  cssStyle?: string;
};

const Stack = React.forwardRef<HTMLDivElement, StackProps & { children: ReactNode }>(
  (
    { cssStyle, align, direction = 'horizontal', spacing = 12, children, wrap, justify },
    ref
  ) => {
    const style: CSSObject = {
      alignItems: align,
      justifyContent: justify,
      flexDirection: direction === 'vertical' ? 'column' : 'row',
      display: 'inline-flex',
      columnGap: spacing,
      rowGap: spacing,
      flexWrap: wrap ? 'wrap' : 'nowrap',
    };

    return (
      <div
        ref={ref}
        className={css`
          ${style}
          ${cssStyle}
        `}
      >
        {children}
      </div>
    );
  }
);

export default implementRuntimeComponent({
  version: CORE_VERSION,
  metadata: {
    name: 'stack',
    displayName: 'Stack',
    description: '',
    isDraggable: true,
    isResizable: false,
    exampleProperties: {
      spacing: 12,
      direction: 'horizontal',
      align: 'auto',
      wrap: '',
      justify: '',
    },
    exampleSize: [4, 1],
    annotations: {
      category: 'Layout',
    },
  },
  spec: {
    properties: StackPropertySpec,
    state: StateSpec,
    methods: {},
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content'],
    events: [],
  },
})(({ customStyle, elementRef, slotsElements, ...restProps }) => {
  return (
    <Stack cssStyle={customStyle?.content} ref={elementRef} {...restProps}>
      {slotsElements.content ? <slotsElements.content /> : null}
    </Stack>
  );
});
