import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';
import { CORE_VERSION, CoreWidgetName } from '@sunmao-ui/shared';

export const SliderPropsSpec = {
  min: Type.Number({
    title: 'Min',
    category: Category.Basic,
  }),
  max: Type.Number({
    title: 'Max',
    category: Category.Basic,
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Behavior,
  }),
  toolTipPosition: Type.Optional(
    StringUnion(
      ['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'],
      {
        category: Category.Layout,
        title: 'Tooltip Position',
      }
    )
  ),
  vertical: Type.Boolean({
    title: 'Vertical',
    category: Category.Layout,
  }),
  tooltipVisible: Type.Boolean({
    title: 'Show Tooltip',
    category: Category.Behavior,
  }),
  range: Type.Boolean({
    title: 'Enable Range',
    category: Category.Behavior,
  }),
  step: Type.Number({
    title: 'Step',
    category: Category.Behavior,
  }),
  showTicks: Type.Boolean({
    title: 'Show Ticks',
    category: Category.Behavior,
    description: 'Whether to display step tick marks',
  }),
  // TODO Perhaps a custom widget could be used
  marks: Type.Object(
    {},
    {
      title: 'Marks',
      widget: `${CORE_VERSION}/${CoreWidgetName.RecordField}`,
      category: Category.Behavior,
    }
  ),
  onlyMarkValue: Type.Boolean({
    title: 'Only Mark Value',
    category: Category.Behavior,
    description: 'Whether only the mark value can be selected',
  }),
  reverse: Type.Boolean({
    title: 'Reverse',
    category: Category.Behavior,
  }),
};
