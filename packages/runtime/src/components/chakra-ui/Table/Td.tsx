import React from 'react';
import { Static } from '@sinclair/typebox';
import { apiService } from '../../../api-service';
import { ColumnSchema } from './TableTypes';
import { Button, Td } from '@chakra-ui/react';

export const TableTd: React.FC<{
  item: any;
  column: Static<typeof ColumnSchema>;
  onClickItem: () => void;
}> = props => {
  const { item, column, onClickItem } = props;
  switch (column.type) {
    case 'image':
      return (
        <Td>
          <img src={item[column.key]} />
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
      return <Td>{item[column.key]}</Td>;
  }
};
