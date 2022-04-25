import React, { useMemo } from 'react';
import { SpecWidget } from './SpecWidget';
import { WidgetProps } from '../../types/widget';
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
import { PRESET_PROPERTY_CATEGORY, CORE_VERSION, CATEGORY_WIDGET_NAME } from '@sunmao-ui/shared';
import { shouldRender } from '../../utils/condition';

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

type Property = Record<string, WidgetProps['spec']>;

type Category = {
  name: string;
  specs: WidgetProps['spec'][];
};

export const CategoryWidget: React.FC<WidgetProps> = props => {
  const { component, spec, value, path, level, services, onChange } = props;

  const categories = useMemo<Category[]>(() => {
    const properties = (spec.properties || {}) as Property;
    Object.keys(properties).forEach(name => {
      const propertySpec = properties[name];
      propertySpec.name = name;
    });
    const grouped = groupBy(properties, c => c.category || 'Advance');

    return sortBy(
      Object.keys(grouped).map(name => ({
        name,
        specs: sortBy(grouped[name], c => -(c.weight ?? -Infinity)),
      })),
      c => -getCategoryOrder(c.name)
    );
  }, [spec.properties]);

  return (
    <Accordion width="full" defaultIndex={[0]} allowMultiple>
      {categories.map(category => {
        const specs = category.specs;

        return (
          <AccordionItem width="full" key={category.name} background="#F7FAFC">
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {category.name}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel bg="white">
              {specs.map(propertySpec => {
                const name = propertySpec.name;

                if (typeof propertySpec === 'boolean') {
                  return null;
                }
                return shouldRender(propertySpec.conditions || [], value) ? (
                  <SpecWidget
                    key={name}
                    component={component}
                    spec={{
                      ...propertySpec,
                      title: propertySpec.title || name,
                    }}
                    value={value?.[name!]}
                    path={path.concat(name!)}
                    level={level + 1}
                    services={services}
                    onChange={newValue => {
                      onChange({
                        ...value,
                        [name!]: newValue,
                      });
                    }}
                  />
                ) : null;
              })}
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default implementWidget({
  version: CORE_VERSION,
  metadata: {
    name: CATEGORY_WIDGET_NAME,
  },
})(CategoryWidget);
