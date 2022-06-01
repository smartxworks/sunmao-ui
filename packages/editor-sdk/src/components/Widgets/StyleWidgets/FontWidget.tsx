import React from 'react';
import { HStack, Select, Text } from '@chakra-ui/react';
import { CORE_VERSION, StyleWidgetName } from '@sunmao-ui/shared';
import { WidgetProps } from '../../../types/widget';
import { implementWidget } from '../../../utils/widget';
import { ExpressionEditor } from '../../Form';

type Font = {
  fontSize?: string | number;
  fontWeight?: string | number;
};

const WeightOptions = [
  { value: 100, label: 'Thin' },
  { value: 200, label: 'Extra Light' },
  { value: 300, label: 'Light' },
  { value: 400, label: 'Normal' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'Semi Bold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'Extra Bold' },
  { value: 900, label: 'Black ' },
];

export const FontWidget: React.FC<WidgetProps<{}, Font>> = props => {
  const { value, onChange } = props;

  return (
    <HStack>
      <Text>Size</Text>
      <ExpressionEditor
        compact={true}
        defaultCode={value.fontSize === undefined ? '' : String(value.fontSize)}
        onBlur={v => {
          const newFont = {
            ...value,
            fontSize: v,
          };
          onChange(newFont);
        }}
      />
      <Text>Weight</Text>
      <Select
        size="sm"
        defaultValue={value.fontWeight || 100}
        onChange={e => {
          const newFont = {
            ...value,
            fontWeight: e.target.value,
          };
          onChange(newFont);
        }}
      >
        {WeightOptions.map(o => {
          return (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          );
        })}
      </Select>
    </HStack>
  );
};

export default implementWidget({
  version: CORE_VERSION,
  metadata: {
    name: StyleWidgetName.Size,
  },
})(FontWidget);
