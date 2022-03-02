import React, { useMemo } from 'react';
import { SchemaField } from './SchemaField';
import { WidgetProps } from '../../types';
import { implementWidget } from '../../utils/widget';
import { sortBy, groupBy } from 'lodash-es';
import {
  AccordionPanel,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Box,
  Accordion,
} from '@chakra-ui/react';
import { PRESET_PROPERTY_CATEGORY } from '../../constants/category';

const PRESET_PROPERTY_CATEGORY_WEIGHT: Record<
  keyof typeof PRESET_PROPERTY_CATEGORY | 'Advance',
  number
> = {
  Data: 100,
  Columns: 99,
  Basic: 98,
  Behavior: 3,
  Layout: 2,
  Style: 1,
  Advance: -Infinity,
};

function getCategoryOrder(name: string): number {
  return name in PRESET_PROPERTY_CATEGORY_WEIGHT
    ? PRESET_PROPERTY_CATEGORY_WEIGHT[
        name as keyof typeof PRESET_PROPERTY_CATEGORY_WEIGHT
      ]
    : 0;
}

type Property = Record<string, WidgetProps['schema']>;

type Category = {
  name: string;
  schemas: WidgetProps['schema'][];
};

export const CategoryWidget: React.FC<WidgetProps> = props => {
  const { component, schema, value, level, services, onChange } = props;

  const categories = useMemo<Category[]>(() => {
    const properties = (schema.properties || {}) as Property;
    Object.keys(properties).forEach(name => {
      const schema = properties[name];
      schema.name = name;
    });
    const grouped = groupBy(properties, c => c.category || 'Advance');

    return sortBy(
      Object.keys(grouped).map(name => ({
        name,
        schemas: sortBy(grouped[name], c => -(c.weight ?? -Infinity)),
      })),
      c => -getCategoryOrder(c.name)
    );
  }, [schema.properties]);

  return (
    <Accordion width="full" defaultIndex={[0]} allowMultiple>
      {categories.map(category => {
        const schemas = category.schemas;

        return (
          <AccordionItem width="full" key={category.name} background="#F7FAFC">
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {category.name}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel bg="white">
              {schemas.map(schema => {
                const name = schema.name;

                if (typeof schema === 'boolean') {
                  return null;
                }
                return (
                  <SchemaField
                    key={name}
                    component={component}
                    schema={schema}
                    value={value?.[name!]}
                    level={level + 1}
                    services={services}
                    onChange={value => {
                      onChange({
                        ...value,
                        [name!]: value,
                      });
                    }}
                  />
                );
              })}
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default implementWidget({
  version: 'core/v1',
  metadata: {
    name: 'CategoryWidget',
  },
})(CategoryWidget);
