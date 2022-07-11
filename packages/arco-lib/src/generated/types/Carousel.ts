import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const CarouselPropsSpec = {
  imageSrc: Type.Array(Type.String(), {
    title: 'Image Src',
    category: Category.Basic,
  }),
  indicatorType: StringUnion(['dot', 'line', 'slider'], {
    title: 'Indicator Type',
    category: Category.Basic,
  }),
  indicatorPosition: StringUnion(['left', 'right', 'top', 'bottom', 'outer'], {
    title: 'Indicator Type',
    category: Category.Basic,
  }),
  direction: StringUnion(['vertical', 'horizontal'], {
    title: 'Direction',
    category: Category.Basic,
  }),
  showArrow: StringUnion(['always', 'hover', 'never'], {
    title: 'Show Arrow',
    category: Category.Behavior,
  }),
  animation: StringUnion(['slide', 'card', 'fade'], {
    title: 'Animation',
    category: Category.Behavior,
  }),
  moveSpeed: Type.Number({
    title: 'Move Speed',
    category: Category.Behavior,
  }),
  trigger: Type.Optional(
    StringUnion(['click', 'hover'], {
      title: 'Trigger',
      category: Category.Behavior,
    })
  ),
  autoPlay: Type.Boolean({
    title: 'Auto Play',
    category: Category.Behavior,
  }),
  autoPlayInterval: Type.Optional(
    Type.Number({
      title: 'Auto Play Interval',
      category: Category.Behavior,
      conditions: [{ key: 'autoPlay', value: true }],
    })
  ),
  autoPlayHoverToPause: Type.Optional(
    Type.Boolean({
      title: 'Auto Play Hover To Pause',
      category: Category.Behavior,
      conditions: [{ key: 'autoPlay', value: true }],
    })
  ),
  timingFunc: Type.String({
    title: 'Timing Func',
    category: Category.Behavior,
  }),
};
