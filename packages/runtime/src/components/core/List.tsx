import { Type } from '@sinclair/typebox';
import { css } from '@emotion/css';
import { LIST_ITEM_EXP, LIST_ITEM_INDEX_EXP } from '../../constants';
import { implementRuntimeComponent } from '../../utils/buildKit';
import { ImplWrapper } from '../_internal/ImplWrapper';

const PropsSpec = Type.Object({
  listData: Type.Array(Type.Record(Type.String(), Type.String()), {
    title: 'Data',
    category: 'Basic',
    widget: `core/v1/expression`,
  }),
  itemId: Type.String(),
});

const exampleProperties = {
  listData: [{ id: '1' }, { id: '2' }, { id: '3' }],
  itemId: 'listItemName-{{$listItem.id}}',
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
    slots: {
      content: {
        slotProps: Type.Object({
          [LIST_ITEM_EXP]: Type.Any(),
          [LIST_ITEM_INDEX_EXP]: Type.Number(),
        }),
      },
    },
    styleSlots: ['content'],
    events: [],
  },
})(({ listData, app, services, customStyle, elementRef }) => {
  if (!listData) {
    return null;
  }

  const childSchema = app.spec.components.find(c => c.id === 'listSlot')!;
  const listItems = listData.map((listItem, i) => {
    // const evalScope = {
    //   [LIST_ITEM_EXP]: listItem,
    //   [LIST_ITEM_INDEX_EXP]: i,
    // };
    const _childSchema = {
      ...childSchema,
      id: `list_${childSchema.id}${i}`,
    };
    const listItemEle = (
      <ImplWrapper
        component={_childSchema}
        app={app}
        services={services}
        childrenMap={{}}
        isInModule
        evalListItem
        slotProps={{
          [LIST_ITEM_EXP]: listItem,
          [LIST_ITEM_INDEX_EXP]: i,
        }}
      />
    );

    return listItemEle;
  });

  return (
    <ul
      className={css`
        list-style: none;
        ${customStyle?.content}
      `}
      ref={elementRef}
    >
      {listItems}
    </ul>
  );
});
