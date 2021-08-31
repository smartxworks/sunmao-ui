import React from 'react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { Box as BaseBox } from '@chakra-ui/react';
import { ComponentImplementation } from '../../registry';
import Slot from '../_internal/Slot';
import { pick } from 'lodash';

const CssGlobals = Type.KeyOf(
  Type.Object({
    '-moz-initial': Type.String(),
    inherit: Type.String(),
    initial: Type.String(),
    revert: Type.String(),
    unset: Type.String(),
  })
);
const LineStyle = Type.KeyOf(
  Type.Object({
    dashed: Type.String(),
    dotted: Type.String(),
    double: Type.String(),
    groove: Type.String(),
    hidden: Type.String(),
    inset: Type.String(),
    none: Type.String(),
    outset: Type.String(),
    ridge: Type.String(),
    solid: Type.String(),
  })
);
const TextAlign = Type.Union([
  CssGlobals,
  Type.KeyOf(
    Type.Object({
      center: Type.String(),
      end: Type.String(),
      justify: Type.String(),
      left: Type.String(),
      'match-parent': Type.String(),
      right: Type.String(),
      start: Type.String(),
    })
  ),
]);
const TextTransForm = Type.Union([
  CssGlobals,
  Type.KeyOf(
    Type.Object({
      capitalize: Type.String(),
      'full-size-kana': Type.String(),
      'full-width': Type.String(),
      lowercase: Type.String(),
      none: Type.String(),
      uppercase: Type.String(),
    })
  ),
]);
const Overflow = Type.Union([
  CssGlobals,
  Type.KeyOf(
    Type.Object({
      '-moz-hidden-unscrollable': Type.String(),
      auto: Type.String(),
      clip: Type.String(),
      hidden: Type.String(),
      scroll: Type.String(),
      visible: Type.String(),
    })
  ),
]);
const FlexWrap = Type.Union([
  CssGlobals,
  Type.KeyOf(
    Type.Object({
      nowrap: Type.String(),
      wrap: Type.String(),
      'wrap-reverse': Type.String(),
    })
  ),
]);
const FlexDirection = Type.Union([
  CssGlobals,
  Type.KeyOf(
    Type.Object({
      column: Type.String(),
      'column-reverse': Type.String(),
      row: Type.String(),
      'row-reverse': Type.String(),
    })
  ),
]);
const Position = Type.Union([
  CssGlobals,
  Type.KeyOf(
    Type.Object({
      '-webkit-sticky': Type.String(),
      absolute: Type.String(),
      fixed: Type.String(),
      relative: Type.String(),
      static: Type.String(),
      sticky: Type.String(),
    })
  ),
]);
const WordBreak = Type.Union([
  CssGlobals,
  Type.KeyOf(
    Type.Object({
      'break-all': Type.String(),
      'break-word': Type.String(),
      'keep-all': Type.String(),
      normal: Type.String(),
    })
  ),
]);
const WhiteSpace = Type.Union([
  CssGlobals,
  Type.KeyOf(
    Type.Object({
      '-moz-pre-wrap': Type.String(),
      'break-spaces': Type.String(),
      normal: Type.String(),
      nowrap: Type.String(),
      pre: Type.String(),
      'pre-line': Type.String(),
      'pre-wrap': Type.String(),
    })
  ),
]);
const BoxSizing = Type.Union([
  CssGlobals,
  Type.KeyOf(
    Type.Object({
      'border-box': Type.String(),
      'content-box': Type.String(),
    })
  ),
]);
const PointerEvent = Type.Union([
  CssGlobals,
  Type.KeyOf(
    Type.Object({
      all: Type.String(),
      auto: Type.String(),
      fill: Type.String(),
      none: Type.String(),
      painted: Type.String(),
      stroke: Type.String(),
      visible: Type.String(),
      visibleFill: Type.String(),
      visiblePainted: Type.String(),
      visibleStroke: Type.String(),
    })
  ),
]);

const StyleSchema = Type.Partial(
  Type.Object({
    // Margin and padding
    m: Type.Union([Type.String(), Type.Number(), Type.Array(Type.Number())]),
    mt: Type.Union([Type.String(), Type.Number()]),
    mr: Type.Union([Type.String(), Type.Number()]),
    mb: Type.Union([Type.String(), Type.Number()]),
    ml: Type.Union([Type.String(), Type.Number()]),
    mx: Type.Union([Type.String(), Type.Number(), Type.Array(Type.Number())]),
    my: Type.Union([Type.String(), Type.Number(), Type.Array(Type.Number())]),
    p: Type.Union([Type.String(), Type.Number(), Type.Array(Type.Number())]),
    pt: Type.Union([Type.String(), Type.Number()]),
    pr: Type.Union([Type.String(), Type.Number()]),
    pb: Type.Union([Type.String(), Type.Number()]),
    pl: Type.Union([Type.String(), Type.Number()]),
    px: Type.Union([Type.String(), Type.Number(), Type.Array(Type.Number())]),
    py: Type.Union([Type.String(), Type.Number(), Type.Array(Type.Number())]),
    // Color and background color
    color: Type.String(),
    bgColor: Type.String(),
    opacity: Type.Union([Type.String(), Type.Number()]),
    // Gradient
    bgGradient: Type.String(),
    bgClip: Type.String(),
    // Typography
    fontFamily: Type.String(),
    fontSize: Type.Union([Type.String(), Type.Number()]),
    fontWeight: Type.Union([Type.String(), Type.Number()]),
    lineHeight: Type.Union([Type.String(), Type.Number()]),
    letterSpacing: Type.Union([Type.String(), Type.Number()]),
    textAlign: TextAlign,
    fontStyle: Type.String(),
    textTransform: TextTransForm,
    textDecoration: Type.Union([Type.String(), Type.Number()]),
    // Layout, width and height
    w: Type.Union([Type.String(), Type.Number()]),
    h: Type.Union([Type.String(), Type.Number()]),
    minW: Type.Union([Type.String(), Type.Number()]),
    maxW: Type.Union([Type.String(), Type.Number()]),
    minH: Type.Union([Type.String(), Type.Number()]),
    maxH: Type.Union([Type.String(), Type.Number()]),
    display: Type.String(),
    verticalAlign: Type.String(),
    overflow: Type.String(),
    overflowX: Overflow,
    overflowY: Overflow,
    // Flexbox
    alignItems: Type.String(),
    alignContent: Type.String(),
    justifyItems: Type.String(),
    justifyContent: Type.String(),
    flexWrap: FlexWrap,
    flexDirection: FlexDirection,
    flex: Type.Union([Type.String(), Type.Number()]),
    flexGrow: Type.Union([CssGlobals, Type.Number()]),
    flexShrink: Type.Union([CssGlobals, Type.Number()]),
    flexBasis: Type.Union([Type.String(), Type.Number()]),
    justifySelf: Type.String(),
    alignSelf: Type.String(),
    order: Type.Union([CssGlobals, Type.Number()]),
    // Background
    bg: Type.String(),
    bgImage: Type.String(),
    bgSize: Type.Union([Type.String(), Type.Number()]),
    bgPosition: Type.Union([Type.String(), Type.Number()]),
    bgRepeat: Type.String(),
    bgAttachment: Type.String(),
    // Borders
    border: Type.Union([Type.String(), Type.Number()]),
    borderWidth: Type.Union([Type.String(), Type.Number()]),
    borderStyle: Type.String(),
    borderColor: Type.String(),
    borderTop: Type.Union([Type.String(), Type.Number()]),
    borderTopWidth: Type.Union([Type.String(), Type.Number()]),
    borderTopStyle: Type.Union([CssGlobals, LineStyle]),
    borderTopColor: Type.String(),
    borderRight: Type.Union([Type.String(), Type.Number()]),
    borderRightWidth: Type.Union([Type.String(), Type.Number()]),
    borderRightStyle: Type.Union([CssGlobals, LineStyle]),
    borderRightColor: Type.String(),
    borderBottom: Type.Union([Type.String(), Type.Number()]),
    borderBottomWidth: Type.Union([Type.String(), Type.Number()]),
    borderBottomStyle: Type.Union([CssGlobals, LineStyle]),
    borderBottomColor: Type.String(),
    borderLeft: Type.Union([Type.String(), Type.Number()]),
    borderLeftWidth: Type.Union([Type.String(), Type.Number()]),
    borderLeftStyle: Type.Union([CssGlobals, LineStyle]),
    borderLeftColor: Type.String(),
    borderX: Type.Union([Type.String(), Type.Number()]),
    borderY: Type.Union([Type.String(), Type.Number()]),
    // Border Radius
    borderRadius: Type.Union([Type.String(), Type.Number()]),
    borderTopLeftRadius: Type.Union([Type.String(), Type.Number()]),
    borderTopRightRadius: Type.Union([Type.String(), Type.Number()]),
    borderBottomRightRadius: Type.Union([Type.String(), Type.Number()]),
    borderBottomLeftRadius: Type.Union([Type.String(), Type.Number()]),
    // Position
    pos: Position,
    top: Type.Union([Type.String(), Type.Number()]),
    right: Type.Union([Type.String(), Type.Number()]),
    bottom: Type.Union([Type.String(), Type.Number()]),
    left: Type.Union([Type.String(), Type.Number()]),
    zIndex: Type.Union([Type.String(), Type.Number()]),
    // Shadow
    textShadow: Type.Union([Type.String(), Type.Number()]),
    boxShadow: Type.Union([Type.String(), Type.Number()]),
    // Other
    whiteSpace: WhiteSpace,
    pointerEvents: PointerEvent,
    wordBreak: WordBreak,
    textOverflow: Type.String(),
    boxSizing: BoxSizing,
    cursor: Type.String(),
  })
);
const StyleProps = Object.keys(StyleSchema.properties);

const Box: ComponentImplementation<Static<typeof StyleSchema>> = ({
  slotsMap,
  ...restProps
}) => {
  const styleProps = pick(restProps, StyleProps);

  return (
    <BaseBox {...styleProps}>
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseBox>
  );
};

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'box',
      description: 'chakra-ui box',
    },
    spec: {
      properties: Object.entries(StyleSchema.properties).map(
        ([key, value]) => ({
          name: key,
          ...value,
        })
      ),
      acceptTraits: [],
      state: {},
      methods: [],
    },
  }),
  impl: Box,
};
