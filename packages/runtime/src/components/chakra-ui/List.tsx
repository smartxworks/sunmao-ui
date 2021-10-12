import { useRef } from 'react';
import { Application, createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { List as BaseList, ListItem as BaseListItem } from '@chakra-ui/react';
import { ComponentImplementation } from '../../services/registry';
import { LIST_ITEM_EXP, LIST_ITEM_INDEX_EXP } from '../../constants';
import { parseType } from '../../utils/parseType';
import { ImplWrapper } from '../../services/ImplWrapper';
import { resolveAppComponents } from '../../services/resolveAppComponents';
import { RuntimeApplicationComponent } from 'src/types/RuntimeSchema';

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
  listData,
  template,
  app,
  services,
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

    const evaledTemplate = services.stateManager.mapValuesDeep(
      { parsedtemplete },
      ({ value }) => {
        if (typeof value === 'string') {
          return services.stateManager.maskedEval(value, true, {
            [LIST_ITEM_EXP]: listItem,
            [LIST_ITEM_INDEX_EXP]: i,
          });
        }
        return value;
      }
    ).parsedtemplete;

    const { topLevelComponents, slotComponentsMap } = resolveAppComponents(
      evaledTemplate,
      {
        services,
        app,
      }
    );

    const componentElements = topLevelComponents.map(c => {
      return (
        <ImplWrapper
          key={c.id}
          component={c}
          slotsMap={slotComponentsMap.get(c.id)}
          targetSlot={null}
          services={services}
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
