import React, { useEffect, useMemo, useRef } from 'react';
import {
  Application,
  createComponent,
  RuntimeApplication,
} from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { List as BaseList, ListItem as BaseListItem } from '@chakra-ui/react';
import Text, { TextProps, TextPropertySchema } from '../_internal/Text';
import { ComponentImplementation } from '../../registry';
import { ImplWrapper, resolveAppComponents } from '../../App';
import { mapValuesDeep, maskedEval } from '../../store';
import { values } from 'lodash';
import { parseType } from '../../util-methods';
import { LIST_ITEM_EXP, LIST_ITEM_INDEX_EXP } from '../../constants';

export function parseTypeComponents(
  c: Application['spec']['components'][0]
): RuntimeApplication['spec']['components'][0] {
  return {
    ...c,
    children: [],
    parsedType: parseType(c.type),
    traits: c.traits.map(t => {
      return {
        ...t,
        parsedType: parseType(t.type),
      };
    }),
  };
}

const List: ComponentImplementation<{
  listData: Static<typeof ListDataPropertySchema>;
  template: Static<typeof TemplatePropertySchema>;
  onClick?: () => void;
}> = ({ listData, template, mergeState, subscribeMethods, app }) => {
  if (!listData) {
    return null;
  }
  const itemElementMemo = useRef(new Map());
  const parsedtemplete = template.map(parseTypeComponents);

  const listItems = listData.map((listItem, i) => {
    if (itemElementMemo.current.has(listItem.id)) {
      if (itemElementMemo.current.get(listItem.id).value === listItem) {
        return itemElementMemo.current.get(listItem.id).ele;
      }
    }

    const evaledTemplate = mapValuesDeep(
      { parsedtemplete },
      ({ value, key }) => {
        if (typeof value === 'string') {
          return maskedEval(value, true, {
            [LIST_ITEM_EXP]: listItem,
            [LIST_ITEM_INDEX_EXP]: i,
          });
        }
        return value;
      }
    ).parsedtemplete;

    const { topLevelComponents, slotComponentsMap } = resolveAppComponents(
      evaledTemplate,
      app
    );

    const componentElements = topLevelComponents.map(c => {
      return (
        <ImplWrapper
          key={c.id}
          component={c}
          slotsMap={slotComponentsMap.get(c.id)}
          targetSlot={null}
          app={app}
        />
      );
    });

    const listItemEle = (
      <BaseListItem key={listItem.id} spacing={3}>
        {componentElements}
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

const ListDataPropertySchema = Type.Array(
  Type.Object(Type.String(), Type.String())
);
const TemplatePropertySchema = Type.Object(
  Type.String(),
  Type.Array(Type.Object(Type.String()))
);

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'list',
      description: 'chakra-ui list',
    },
    spec: {
      properties: [
        {
          name: 'listData',
          ...ListDataPropertySchema,
        },
        {
          name: 'template',
          ...TemplatePropertySchema,
        },
      ],
      acceptTraits: [],
      methods: [],
      state: {},
    },
  }),
  impl: List,
};
