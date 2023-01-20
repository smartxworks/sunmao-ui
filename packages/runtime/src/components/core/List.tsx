import { Type } from '@sinclair/typebox';
import { css } from '@emotion/css';
import { LIST_ITEM_EXP, LIST_ITEM_INDEX_EXP } from '../../constants';
import { implementRuntimeComponent } from '../../utils/buildKit';
import { ImplWrapper } from '../_internal/ImplWrapper';
import { formatSlotKey } from '../_internal/ImplWrapper/hooks/useSlotChildren';
import React from 'react';

const PropsSpec = Type.Object({
  listData: Type.Array(Type.Record(Type.String(), Type.String()), {
    title: 'Data',
    category: 'Basic',
    widget: `core/v1/expression`,
  }),
});

const exampleProperties = {
  listData: [{ id: '1' }, { id: '2' }, { id: '3' }],
};

export default implementRuntimeComponent({
  version: 'core/v1',
  metadata: {
    name: 'list',
    description: 'core list',
    displayName: 'List',
    exampleProperties,
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
})(
  ({
    listData,
    component,
    app,
    services,
    allComponents,
    customStyle,
    elementRef,
    slotsElements,
  }) => {
    if (!listData) {
      return null;
    }
    const childrenSchema = allComponents.filter(c => {
      return c.traits.find(
        t =>
          (t.type === 'core/v1/slot' || t.type === 'core/v2/slot') &&
          (t.properties.container as any).id === component.id
      );
    });
    if (childrenSchema.length === 0) {
      return (
        <div
          className={css`
            ${customStyle?.content}
          `}
          ref={elementRef}
        >
          List has no children. Drag components into here to add listItems.
        </div>
      );
    }

    const listItems = listData.map((listItem, i) => {
      const _childrenSchema = childrenSchema.map(child => {
        return {
          ...child,
          id: `${component.id}_${child.id}_${i}`,
        };
      });

      /**
       * FIXME: temporary hack
       */
      slotsElements.content?.(
        {
          [LIST_ITEM_EXP]: listItem,
          [LIST_ITEM_INDEX_EXP]: i,
        },
        undefined,
        `content_${i}`
      );

      const childrenEles = _childrenSchema.map(child => {
        return (
          <ImplWrapper
            key={child.id}
            component={child}
            app={app}
            allComponents={allComponents}
            services={services}
            childrenMap={{}}
            isInModule
            slotContext={{
              renderSet: new Set(),
              slotKey: formatSlotKey(component.id, 'content', `content_${i}`),
            }}
          />
        );
      });

      return <li key={i}>{childrenEles}</li>;
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
  }
);
