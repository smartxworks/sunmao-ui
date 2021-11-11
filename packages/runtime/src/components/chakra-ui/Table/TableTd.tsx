import { RuntimeApplication } from '@meta-ui/core';
import { Static } from '@sinclair/typebox';
import { ColumnSchema } from './TableTypes';
import { Button, Link, Td, Text } from '@chakra-ui/react';
import { LIST_ITEM_EXP, LIST_ITEM_INDEX_EXP } from '../../../constants';
import { MetaUIServices } from 'src/types/RuntimeSchema';
import { ModuleRenderer } from '../../_internal/ModuleRenderer';

export const TableTd: React.FC<{
  index: number;
  item: any;
  column: Static<typeof ColumnSchema>;
  onClickItem: () => void;
  services: MetaUIServices;
  app?: RuntimeApplication;
}> = props => {
  const { item, index, column, onClickItem, services, app } = props;
  let value = item[column.key];

  if (column.displayValue) {
    value = services.stateManager.maskedEval(column.displayValue, true, {
      [LIST_ITEM_EXP]: item,
    });
  }

  let content = value;
  switch (column.type) {
    case 'text':
      content = <Text whiteSpace="pre-wrap">{value}</Text>;
      break;
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
    case 'module':
      const evalScope = {
        [LIST_ITEM_EXP]: item,
        [LIST_ITEM_INDEX_EXP]: index,
      };
      content = (
        <ModuleRenderer
          id={column.module.id}
          type={column.module.type}
          properties={column.module.properties}
          handlers={column.module.handlers}
          services={services}
          evalScope={evalScope}
          app={app}
        />
      );
      break;
  }

  return (
    <Td paddingX="4" paddingY="2">
      {content}
    </Td>
  );
};
