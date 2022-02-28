import React, { ReactNode } from 'react';
import { css, CSSObject } from '@emotion/css';
import { Static, Type } from '@sinclair/typebox';
import { StringUnion } from '../../utils/stringUnion';

export const SpacePropertySchema = Type.Object({
  align: StringUnion(['start', 'end', 'center', 'baseline'],{
    title:'Align',
    category:'Layout'
  }),
  direction: StringUnion(['vertical', 'horizontal'],{
    title:'Direction',
    category:'Layout'
  }),
  justifyContent: StringUnion([
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
  ],{
    title:'Justify Content',
    category:'Layout'
  }),
  size: Type.Union([StringUnion(['mini', 'small', 'middle', 'large']), Type.Number()],{
    title:'Size',
    category:'Layout'
  }),
  wrap: Type.Boolean({
    title:'Wrap',
    category:'Layout',
    description:'Auto wrap line, when horizontal effective'
  }),
});

export type SpaceProps = Static<typeof SpacePropertySchema> & {
  cssStyle?: string;
};

const spaceSize = {
  mini: 4,
  small: 8,
  middle: 16,
  large: 24,
};

type SpaceSize = SpaceProps['size'];

function getNumberSize(size: SpaceSize) {
  return typeof size === 'string' ? spaceSize[size] : size || 0;
}

const Space = React.forwardRef<HTMLDivElement, SpaceProps & { children: ReactNode }>(
  (
    {
      cssStyle,
      align,
      direction = 'horizontal',
      size = 'small',
      children,
      wrap,
      justifyContent,
    },
    ref
  ) => {
    const [horizontalSize, verticalSize] = React.useMemo(
      () =>
        ((Array.isArray(size) ? size : [size, size]) as [SpaceSize, SpaceSize]).map(
          item => getNumberSize(item)
        ),
      [size]
    );

    const style: CSSObject = {
      alignItems: align,
      justifyContent,
      flexDirection: direction === 'vertical' ? 'column' : 'row',
      display: 'inline-flex',
      columnGap: horizontalSize,
      rowGap: verticalSize,
    };

    if (wrap) {
      style.flexWrap = 'wrap';
    }

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

export default Space;
