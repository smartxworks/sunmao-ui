import React from 'react';
import {
  RuntimeApplication,
  RuntimeComponentSchema,
  PropsBeforeEvaled,
} from '@sunmao-ui/core';
import { Static } from '@sinclair/typebox';
import { ColumnSpec, ColumnsPropertySpec, ContentSlotPropsSpec } from './TableTypes';
import { Button, Link, Td, Text } from '@chakra-ui/react';
import {
  LIST_ITEM_EXP,
  LIST_ITEM_INDEX_EXP,
  ModuleRenderer,
  UIServices,
  ImplWrapper,
  SlotsElements,
  formatSlotKey,
} from '@sunmao-ui/runtime';

export const TableTd: React.FC<{
  index: number;
  item: any;
  column: Static<typeof ColumnSpec>;
  rawColumns: string | PropsBeforeEvaled<Static<typeof ColumnsPropertySpec>>;
  onClickItem: () => void;
  services: UIServices;
  component: RuntimeComponentSchema;
  allComponents: RuntimeComponentSchema[];
  app: RuntimeApplication;
  slotsElements: SlotsElements<{
    content: {
      slotProps: typeof ContentSlotPropsSpec;
    };
  }>;
}> = props => {
  const {
    item,
    index,
    component,
    column,
    rawColumns,
    onClickItem,
    services,
    app,
    allComponents,
    slotsElements,
  } = props;
  const evalOptions = {
    scopeObject: {
      [LIST_ITEM_EXP]: item,
    },
  };

  let value = item[column.key];
  let buttonConfig = column.buttonConfig;
  const evaledColumn = services.stateManager.deepEval(
    rawColumns[index],
    evalOptions
  ) as Static<typeof ColumnSpec>;

  if (evaledColumn.displayValue) {
    value = evaledColumn.displayValue;
  }

  if (evaledColumn.buttonConfig) {
    buttonConfig = evaledColumn.buttonConfig;
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
        evaledColumn.buttonConfig.handlers.forEach(evaledHandler => {
          services.apiService.send('uiMethod', {
            componentId: evaledHandler.componentId,
            name: evaledHandler.method.name,
            parameters: evaledHandler.method.parameters,
            triggerId: component.id,
            eventType: 'onClick',
          });
        });
      };
      content = <Button onClick={onClick}>{buttonConfig.text}</Button>;
      break;
    case 'module':
      content = (
        <ModuleRenderer
          id={column.module.id}
          type={column.module.type}
          properties={column.module.properties}
          handlers={column.module.handlers}
          services={services}
          evalScope={{
            [LIST_ITEM_EXP]: item,
            [LIST_ITEM_INDEX_EXP]: index,
          }}
          app={app}
        />
      );
      break;
    case 'component':
      const childrenSchema = allComponents.filter(c => {
        return c.traits.find(
          t =>
            (t.type === 'core/v1/slot' || t.type === 'core/v2/slot') &&
            (t.properties.container as any).id === component.id
        );
      });

      const childSchema = childrenSchema[column.componentSlotIndex];
      if (!childSchema) {
        return (
          <div>Cannot find child with index {column.componentSlotIndex} in slot.</div>
        );
      }

      const _childrenSchema = {
        ...childSchema,
        id: `${component.id}_${childSchema.id}_${index}`,
      };

      /**
       * FIXME: temporary hack
       */
      slotsElements.content?.({
        [LIST_ITEM_EXP]: item,
        [LIST_ITEM_INDEX_EXP]: index,
      });

      content = (
        <ImplWrapper
          key={_childrenSchema.id}
          component={_childrenSchema}
          app={app}
          allComponents={allComponents}
          services={services}
          childrenMap={{}}
          isInModule
          slotContext={{
            renderSet: new Set(),
            slotKey: formatSlotKey(_childrenSchema.id, 'td', `td_${index}`),
          }}
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
