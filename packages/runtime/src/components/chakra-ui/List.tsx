import { useRef } from 'react';
import { Application, createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { List as BaseList, ListItem as BaseListItem } from '@chakra-ui/react';
import { ComponentImplementation } from '../../services/registry';
import { LIST_ITEM_EXP, LIST_ITEM_INDEX_EXP } from '../../constants';
import { parseType } from '../../utils/parseType';
import { RuntimeApplicationComponent } from 'src/types/RuntimeSchema';
import { ModuleRenderer } from '../_internal/ModuleRenderer';
import { EventHandlerSchema } from '../../types/TraitPropertiesSchema';

export function parseTypeComponents(
  c: Application['spec']['components'][0]
): RuntimeApplicationComponent {
  return {
    ...c,
    parsedType: parseType(c.type),
    traits: c.traits.map(t => {
      return {
        ...t,
        parsedType: parseType(t.type),
      };
    }),
  };
}

const List: ComponentImplementation<Static<typeof PropsSchema>> = ({
  component,
  listData,
  template,
  app,
  services,
}) => {
  if (!listData) {
    return null;
  }
  const itemElementMemo = useRef(new Map());

  const listItems = listData.map((listItem, i) => {
    // this memo only diff listItem, dosen't compare expressions
    if (itemElementMemo.current.has(listItem.id)) {
      if (itemElementMemo.current.get(listItem.id).value === listItem) {
        return itemElementMemo.current.get(listItem.id).ele;
      }
    }
    const evalScope = {
      [LIST_ITEM_EXP]: listItem,
      [LIST_ITEM_INDEX_EXP]: i,
    };
    const listItemEle = (
      <BaseListItem key={listItem.id} spacing={3}>
        <ModuleRenderer
          moduleId={`${component.id}ListItem${i}`}
          type={template.type}
          properties={template.properties}
          handlers={template.handlers}
          services={services}
          evalScope={evalScope}
          app={app}
        />
      </BaseListItem>
    );

    itemElementMemo.current.set(listItem.id, {
      value: listItem,
      ele: listItemEle,
    });
    return listItemEle;
  });

  return <BaseList>{listItems}</BaseList>;
};

const PropsSchema = Type.Object({
  listData: Type.Array(Type.Record(Type.String(), Type.String())),
  template: Type.Object({
    type: Type.String(),
    properties: Type.Object({}),
    handlers: Type.Array(EventHandlerSchema),
  }),
});

const exampleProperties = {
  listData: [
    {
      id: '1',
      name: 'Bowen Tan',
    },
  ],
  template: [
    {
      id: 'listItemName-{{$listItem.id}}',
      type: 'core/v1/text',
      properties: {
        value: {
          raw: 'Name：{{$listItem.name}}',
          format: 'plain',
        },
      },
      traits: [],
    },
  ],
};

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'list',
      description: 'chakra-ui list',
      displayName: 'List',
      isDraggable: true,
      isResizable: true,
      exampleProperties,
      exampleSize: [6, 6],
    },
    spec: {
      properties: PropsSchema,
      methods: [],
      state: {},
      slots: [],
      styleSlots: [],
      events: [],
    },
  }),
  impl: List,
};
