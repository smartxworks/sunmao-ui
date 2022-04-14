import { RuntimeApplication } from '@sunmao-ui/core';
import { Static } from '@sinclair/typebox';
import { ColumnSpec, ColumnsPropertySpec } from './TableTypes';
import { Button, Link, Td, Text } from '@chakra-ui/react';
import {
  LIST_ITEM_EXP,
  LIST_ITEM_INDEX_EXP,
  ModuleRenderer,
  UIServices,
  ExpressionError,
} from '@sunmao-ui/runtime';

export const TableTd: React.FC<{
  index: number;
  item: any;
  column: Static<typeof ColumnSpec>;
  rawColumn: Static<typeof ColumnsPropertySpec>[0];
  onClickItem: () => void;
  services: UIServices;
  app?: RuntimeApplication;
}> = props => {
  const { item, index, column, rawColumn, onClickItem, services, app } = props;
  const evalOptions = {
    evalListItem: true,
    scopeObject: {
      [LIST_ITEM_EXP]: item,
    },
  };
  let value = item[column.key];
  let buttonConfig = column.buttonConfig;

  if (column.displayValue) {
    const result = services.stateManager.maskedEval(column.displayValue, evalOptions);

    value = result instanceof ExpressionError ? '' : result;
  }

  if (column.buttonConfig) {
    buttonConfig = services.stateManager.deepEval(column.buttonConfig, evalOptions);
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
        rawColumn.buttonConfig.handlers.forEach(handler => {
          const evaledHandler = services.stateManager.deepEval(handler, evalOptions);
          services.apiService.send('uiMethod', {
            componentId: evaledHandler.componentId,
            name: evaledHandler.method.name,
            parameters: evaledHandler.method.parameters,
          });
        });
      };
      content = <Button onClick={onClick}>{buttonConfig.text}</Button>;
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
