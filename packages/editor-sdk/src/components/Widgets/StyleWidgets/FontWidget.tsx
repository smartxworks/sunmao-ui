import React from 'react';
import { HStack, Select, Text, VStack } from '@chakra-ui/react';
import { CORE_VERSION, StyleWidgetName } from '@sunmao-ui/shared';
import { WidgetProps } from '../../../types/widget';
import { implementWidget } from '../../../utils/widget';
import { ExpressionEditor } from '../../Form';

type Font = {
  fontSize?: string | number;
  fontWeight?: string | number;
  textAlign?: string;
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
const AlignOptions = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

export const FontWidget: React.FC<WidgetProps<{}, Font>> = props => {
  const { value, onChange } = props;

  return (
    <VStack width="full">
      <HStack width="full">
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
        <Text>Align</Text>
        <Select
          size="sm"
          defaultValue={value.textAlign || 'left'}
          onChange={e => {
            const newFont = {
              ...value,
              textAlign: e.target.value,
            };
            onChange(newFont);
          }}
        >
          {AlignOptions.map(o => {
            return (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            );
          })}
        </Select>
      </HStack>

      <HStack width="full">
        <Text>Weight</Text>
        <Select
          size="sm"
          defaultValue={value.fontWeight || 400}
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
    </VStack>
  );
};

export default implementWidget({
  version: CORE_VERSION,
  metadata: {
    name: StyleWidgetName.Size,
  },
})(FontWidget);
