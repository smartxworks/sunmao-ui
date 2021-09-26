import { Static } from '@sinclair/typebox';
import { apiService } from '../../../api-service';
import { ColumnSchema } from './TableTypes';
import { Button, Td } from '@chakra-ui/react';
import { LIST_ITEM_EXP } from '../../../constants';
import { StateManager } from 'src/store';

export const TableTd: React.FC<{
  item: any;
  column: Static<typeof ColumnSchema>;
  onClickItem: () => void;
  stateManager: StateManager;
}> = props => {
  const { item, column, onClickItem, stateManager } = props;
  let value = item[column.key];

  if (column.displayValue) {
    value = stateManager.maskedEval(column.displayValue, true, {
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
          apiService.send('uiMethod', {
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
