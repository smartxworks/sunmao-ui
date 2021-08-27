import React, { useEffect, useRef } from 'react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import {
  List as BaseList,
  ListItem as BaseListItem,
  ListIcon,
} from '@chakra-ui/react';
import Text, { TextProps, TextPropertySchema } from '../_internal/Text';
import { ComponentImplementation } from '../../registry';
import { ImplWrapper } from '../../App';
import { mapValuesDeep } from '../../store';
import { values } from 'lodash';
import { parseType } from '../../util-methods';

const List: ComponentImplementation<{
  listData: Static<typeof ListDataPropertySchema>;
  template: Static<typeof TemplatePropertySchema>;
  onClick?: () => void;
}> = ({ listData, template, mergeState, subscribeMethods, app }) => {
  // useEffect(() => {
  //   mergeState({ value: text.raw });
  // }, [text.raw]);

  // const ref = useRef<HTMLListElement>(null);
  // useEffect(() => {
  //   subscribeMethods({
  //     click() {
  //       ref.current?.click();
  //     },
  //   });
  // }, []);

  const listItems = listData.map((listItem, i) => {
    // const evaledText = eval(template.properties.value.raw)
    const evaledComponent = mapValuesDeep(template, ({ value, key }) => {
      console.log(value);
      // what will happen if listData was uglified?
      if (typeof value === 'string' && value.includes('$listItem')) {
        const expression = value.replaceAll('$listItem', 'listData[i]');
        console.log('expression', expression);
        return eval(expression);
      }
      return value;
    });
    evaledComponent.parsedType = parseType(evaledComponent.type);
    console.log('evaled', evaledComponent);
    return (
      <BaseListItem key={listItem.name} spacing={3}>
        <ListIcon color="green.500" />
        <ImplWrapper
          component={evaledComponent}
          slotsMap={undefined}
          targetSlot={null}
          app={app}
        />
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
