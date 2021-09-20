import React, { useRef } from 'react';
import {
  Application,
  createComponent,
  RuntimeApplication,
} from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { List as BaseList, ListItem as BaseListItem } from '@chakra-ui/react';
import { ComponentImplementation } from '../../registry';
import { ImplWrapper, resolveAppComponents } from '../../App';
import { mapValuesDeep, maskedEval } from '../../store';
import { LIST_ITEM_EXP, LIST_ITEM_INDEX_EXP } from '../../constants';
import { parseType } from '../../utils/parseType';

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

const List: ComponentImplementation<Static<typeof PropsSchema>> = ({
  listData,
  template,
  app,
}) => {
  if (!listData) {
    return null;
  }
  const itemElementMemo = useRef(new Map());
  const parsedtemplete = template.map(parseTypeComponents);

  const listItems = listData.map((listItem, i) => {
    // this memo only diff listItem, dosen't compare expressions
    if (itemElementMemo.current.has(listItem.id)) {
      if (itemElementMemo.current.get(listItem.id).value === listItem) {
        return itemElementMemo.current.get(listItem.id).ele;
      }
    }

    const evaledTemplate = mapValuesDeep({ parsedtemplete }, ({ value }) => {
      if (typeof value === 'string') {
        return maskedEval(value, true, {
          [LIST_ITEM_EXP]: listItem,
          [LIST_ITEM_INDEX_EXP]: i,
        });
      }
      return value;
    }).parsedtemplete;

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

const PropsSchema = Type.Object({
  listData: Type.Array(Type.Object(Type.String(), Type.String())),
  template: Type.Object(Type.String(), Type.Array(Type.Object(Type.String()))),
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'list',
      description: 'chakra-ui list',
    },
    spec: {
      properties: PropsSchema,
      acceptTraits: [],
      methods: [],
      state: {},
    },
  }),
  impl: List,
};
