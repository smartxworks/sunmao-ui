import React, { useMemo } from 'react';
import SchemaField from './SchemaField';
import { JSONSchema7 } from 'json-schema';
import { FieldProps } from './fields';
import { sortBy, groupBy } from 'lodash-es';
import {
  AccordionPanel,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Box,
  Accordion,
} from '@chakra-ui/react';
import { PRESET_PROPERTY_CATEGORY } from '../../../constants/category';

type ExpandSpec = {
  category?: string;
  weight?: number;
  name?: string;
};

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

type Property = Record<string, JSONSchema7 & ExpandSpec>;

type Category = {
  name: string;
  schemas: (JSONSchema7 & ExpandSpec)[];
};

const TopLevelField: React.FC<FieldProps> = props => {
  const { schema, formData, onChange, registry, stateManager } = props;

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
                    schema={schema}
                    label={schema.title || name!}
                    formData={formData?.[name!]}
                    onChange={value => {
                      onChange({
                        ...formData,
                        [name!]: value,
                      });
                    }}
                    registry={registry}
                    stateManager={stateManager}
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

export default TopLevelField;
