import { Type } from '@sinclair/typebox';
import { css } from '@emotion/css';
import { LIST_ITEM_EXP, LIST_ITEM_INDEX_EXP } from '../../constants';
import { implementRuntimeComponent } from '../../utils/buildKit';
import { ModuleRenderSpec } from '@sunmao-ui/shared';
import { ComponentRenderer } from '../_internal/ComponentRenderer';

const PropsSpec = Type.Object({
  listData: Type.Array(Type.Record(Type.String(), Type.String()), {
    title: 'Data',
    category: 'Basic',
    widget: `core/v1/expression`,
  }),
  template: ModuleRenderSpec,
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
  version: 'core/v1',
  metadata: {
    name: 'list',
    description: 'core list',
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
    slots: [],
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
      <li key={listItem.id}>
        <ComponentRenderer
          id={template.id}
          type={template.type}
          properties={template.properties}
          handlers={template.handlers}
          services={services}
          evalScope={evalScope}
          app={app}
        />
      </li>
    );

    return listItemEle;
  });

  return (
    <ul
      className={css`
        ${customStyle?.content}
      `}
      ref={elementRef}
    >
      {listItems}
    </ul>
  );
});
