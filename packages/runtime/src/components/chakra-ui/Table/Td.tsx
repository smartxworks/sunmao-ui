import { Static } from '@sinclair/typebox';
import { ColumnSchema } from './TableTypes';
import { Button, Td } from '@chakra-ui/react';
import { LIST_ITEM_EXP } from '../../../constants';
import { MetaUIModules } from 'src/types/RuntimeSchema';

export const TableTd: React.FC<{
  item: any;
  column: Static<typeof ColumnSchema>;
  onClickItem: () => void;
  mModules: MetaUIModules;
}> = props => {
  const { item, column, onClickItem, mModules } = props;
  let value = item[column.key];

  if (column.displayValue) {
    value = mModules.stateManager.maskedEval(column.displayValue, true, {
      [LIST_ITEM_EXP]: item,
    });
  }

  switch (column.type) {
    case 'image':
      return (
        <Td>
          <img src={value} />
        </Td>
      );
    case 'button':
      const onClick = () => {
        onClickItem();
        column.buttonConfig.events.forEach(event => {
          mModules.apiService.send('uiMethod', {
            componentId: event.componentId,
            name: event.method.name,
            parameters: event.method.parameters,
          });
        });
      };
      return (
        <Td>
          <Button onClick={onClick}>{column.buttonConfig.text}</Button>
        </Td>
      );

    default:
      return <Td>{value}</Td>;
  }
};
