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

type ExpandSpec = {
  category?: string;
  weight?: number;
  name?: string;
};

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

    const advance = grouped.Advance;
    Reflect.deleteProperty(grouped, 'Advance');

    const categories = Object.keys(grouped).map(name => ({
      name,
      schemas: sortBy(grouped[name], c => -(c.weight ?? -Infinity)),
    }));
    if (advance) {
      categories.push({
        name: 'Advance',
        schemas: sortBy(advance, c => -(c.weight ?? -Infinity)),
      });
    }

    return categories;
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