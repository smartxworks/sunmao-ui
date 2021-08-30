import React, { useEffect, useMemo, useRef } from 'react';
import { createApplication, createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { List as BaseList, ListItem as BaseListItem } from '@chakra-ui/react';
import Text, { TextProps, TextPropertySchema } from '../_internal/Text';
import { ComponentImplementation } from '../../registry';
import { ImplWrapper, resolveAppComponents } from '../../App';
import { mapValuesDeep } from '../../store';
import { values } from 'lodash';
import { parseType } from '../../util-methods';

const List: ComponentImplementation<{
  listData: Static<typeof ListDataPropertySchema>;
  template: Static<typeof TemplatePropertySchema>;
  onClick?: () => void;
}> = ({ listData, template, mergeState, subscribeMethods, app }) => {
  const templateAsApp = useMemo(() => {
    return createApplication({
      ...app,
      spec: {
        components: template as any,
      },
    });
  }, [app, template]);

  const listItems = listData.map((listItem, i) => {
    const evaledTemplate = mapValuesDeep(templateAsApp, ({ value, key }) => {
      // what will happen if listData was uglified?
      if (typeof value === 'string' && value.includes('$listItem')) {
        const expression = value.replaceAll('$listItem', 'listData[i]');
        return eval(expression);
      }
      return value;
    });
    const { topLevelComponents, slotComponentsMap } =
      resolveAppComponents(evaledTemplate);

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

    return (
      <BaseListItem key={listItem.name} spacing={3}>
        {componentElements}
      </BaseListItem>
    );
  });

  return <BaseList>{listItems}</BaseList>;
};

const ListDataPropertySchema = Type.Array(
  Type.Object(Type.String(), Type.String())
);
const TemplatePropertySchema = Type.Object(Type.String(), Type.Unknown());

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
