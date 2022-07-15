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
    const childs = React.Children.toArray(children);

    const style: CSSObject = {
      alignItems: align,
      justifyContent: justify,
      flexDirection: direction === 'vertical' ? 'column' : 'row',
      display: 'inline-flex',
      flexWrap: wrap ? 'wrap' : 'nowrap',
    };

    const getMargin = (index: number) => {
      const isLastOne = childs.length === index + 1;

      if (wrap) {
        return isLastOne
          ? {
              marginBottom: spacing,
            }
          : {
              marginRight: spacing,
              marginBottom: spacing,
            };
      }

      return isLastOne
        ? {}
        : {
            [direction === 'vertical' ? 'marginBottom' : 'marginRight']: spacing,
          };
    };

    return (
      <div
        ref={ref}
        className={css`
          ${style}
          ${cssStyle}
        `}
      >
        {childs.map((child, idx) => {
          return (
            <div
              key={idx}
              className={css`
                ${getMargin(idx)}
              `}
            >
              {child}
            </div>
          );
        })}
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
    exampleProperties: {
      spacing: 12,
      direction: 'horizontal',
      align: 'auto',
      wrap: false,
      justify: 'flex-start',
    },
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
      {slotsElements.content ? slotsElements.content({}) : null}
    </Stack>
  );
});
