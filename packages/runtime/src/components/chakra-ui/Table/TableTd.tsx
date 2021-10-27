import { Static } from '@sinclair/typebox';
import { ColumnSchema } from './TableTypes';
import { Button, Link, Td } from '@chakra-ui/react';
import { LIST_ITEM_EXP } from '../../../constants';
import { MetaUIServices } from 'src/types/RuntimeSchema';

export const TableTd: React.FC<{
  item: any;
  column: Static<typeof ColumnSchema>;
  onClickItem: () => void;
  services: MetaUIServices;
}> = props => {
  const { item, column, onClickItem, services } = props;
  let value = item[column.key];

  if (column.displayValue) {
    value = services.stateManager.maskedEval(column.displayValue, true, {
      [LIST_ITEM_EXP]: item,
    });
  }

  let content = value;
  switch (column.type) {
    case 'image':
      content = <img src={value} />;
      break;
    case 'link':
      content = (
        <Link href={value} color="blue.600">
          {value}
        </Link>
      );
      break;
    case 'button':
      const onClick = () => {
        onClickItem();
        column.buttonConfig.handlers.forEach(handler => {
          services.apiService.send('uiMethod', {
            componentId: handler.componentId,
            name: handler.method.name,
            parameters: handler.method.parameters,
          });
        });
      };
      content = <Button onClick={onClick}>{column.buttonConfig.text}</Button>;
      break;
  }

  return (
    <Td paddingX="4" paddingY="2">
      {content}
    </Td>
  );
};
