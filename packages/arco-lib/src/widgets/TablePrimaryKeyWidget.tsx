import React from 'react';
import { WidgetProps, implementWidget } from '@sunmao-ui/editor-sdk';
import { ColumnSpec } from '../generated/types/Table';
import { Static } from '@sinclair/typebox';
import { Select } from '@arco-design/web-react';
import { ARCO_V1_VERSION } from '../constants/widgets';

type TablePrimaryKeyWidget = 'arco/v1/primaryKey';

declare module '@sunmao-ui/editor-sdk' {
  interface WidgetOptionsMap {
    'arco/v1/primaryKey': Record<string, unknown>;
  }
}

export const TablePrimaryKeyWidget: React.FC<
  WidgetProps<TablePrimaryKeyWidget, string>
> = props => {
  const { value, onChange, component } = props;
  const { properties } = component;
  const columns = properties.columns as Static<typeof ColumnSpec>[];

  const keys = ['auto', ...columns.map(c => c.dataIndex)];

  return (
    <Select
      value={value}
      defaultValue="auto"
      onChange={value => {
        onChange(value);
      }}
    >
      {keys.map(key => {
        return (
          <Select.Option key={key} value={key}>
            {key}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default implementWidget<TablePrimaryKeyWidget>({
  version: ARCO_V1_VERSION,
  metadata: {
    name: 'primaryKey',
  },
})(TablePrimaryKeyWidget);
