import { createComponent } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { List as BaseList, ListItem as BaseListItem } from '@chakra-ui/react';
import { ComponentImplementation } from 'services/registry';
import { LIST_ITEM_EXP, LIST_ITEM_INDEX_EXP } from '../../constants';
import { RuntimeModuleSchema } from 'types/RuntimeSchema';
import { ModuleRenderer } from '../_internal/ModuleRenderer';
import { css } from '@emotion/react';

const List: ComponentImplementation<Static<typeof PropsSchema>> = ({
  listData,
  template,
  app,
  services,
  customStyle,
}) => {
  if (!listData) {
    return null;
  }

  const listItems = listData.map((listItem, i) => {
    const evalScope = {
      [LIST_ITEM_EXP]: listItem,
      [LIST_ITEM_INDEX_EXP]: i,
    };
    const listItemEle = (
      <BaseListItem key={listItem.id} spacing={3}>
        <ModuleRenderer
          id={template.id}
          type={template.type}
          properties={template.properties}
          handlers={template.handlers}
          services={services}
          evalScope={evalScope}
          app={app}
        />
      </BaseListItem>
    );

    return listItemEle;
  });

  return (
    <BaseList
      css={css`
        ${customStyle?.content}
      `}
    >
      {listItems}
    </BaseList>
  );
};

const PropsSchema = Type.Object({
  listData: Type.Array(Type.Record(Type.String(), Type.String())),
  template: RuntimeModuleSchema,
});

const exampleProperties = {
  listData: [
    {
      id: '1',
      name: 'Bowen Tan',
    },
  ],
  template: {
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
      styleSlots: ['content'],
      events: [],
    },
  }),
  impl: List,
};
