import { Type } from '@sinclair/typebox';
import { List as BaseList, ListItem as BaseListItem } from '@chakra-ui/react';
import {
  implementRuntimeComponent,
  LIST_ITEM_EXP,
  LIST_ITEM_INDEX_EXP,
  ModuleSpec,
  ModuleRenderer,
} from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { BASIC } from './constants/category';
import { CORE_VERSION, CoreWidgetName } from '@sunmao-ui/editor-sdk';

const PropsSpec = Type.Object({
  listData: Type.Array(Type.Record(Type.String(), Type.String()), {
    title: 'Data',
    category: BASIC,
    widget: `${CORE_VERSION}/${CoreWidgetName.Expression}`,
  }),
  template: ModuleSpec,
});

const exampleProperties = {
  listData: [{ id: '1' }, { id: '2' }, { id: '3' }],
  template: {
    id: 'listItemName-{{$listItem.id}}',
    type: 'custom/v1/myModule0',
    properties: {
      value: '{{$listItem.id}}',
    },
    handlers: [],
  },
};

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'list',
    description: 'chakra-ui list',
    displayName: 'List',
    isDraggable: true,
    isResizable: true,
    exampleProperties,
    exampleSize: [6, 6],
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: PropsSpec,
    methods: {},
    state: Type.Object({}),
    slots: {},
    styleSlots: ['content'],
    events: [],
  },
})(({ listData, template, app, services, customStyle, elementRef }) => {
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
      className={css`
        ${customStyle?.content}
      `}
      ref={elementRef}
    >
      {listItems}
    </BaseList>
  );
});
