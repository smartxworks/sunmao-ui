import { useMemo } from 'react';
import { FormControl, FormLabel, VStack, Box } from '@chakra-ui/react';
import { ApplicationComponent } from '@sunmao-ui/core';
import { Registry } from '@sunmao-ui/runtime';
import { CssEditor } from '../../../components/CodeEditor';
import { eventBus } from '../../../eventBus';
import { genOperation } from 'operations';

type Props = {
  registry: Registry;
  component: ApplicationComponent;
};

export const StyleTraitForm: React.FC<Props> = props => {
  const { component, registry } = props;

  const styleSlots = useMemo(() => {
    return registry.getComponentByType(component.type).spec.styleSlots;
  }, [component, registry]);
  const styles = useMemo(() => {
    return component.traits.filter(t => t.type === 'core/v1/style');
  }, [component]);

  if (!styleSlots.length) {
    return null;
  }

  return (
    <VStack width="full">
      <Box fontWeight="bold" textAlign="left" width="100%">
        Styles
      </Box>
      {styleSlots.map(styleSlot => {
        const styleTrait = styles.find(s => s.properties.styleSlot === styleSlot);
        const defaultCode = (styleTrait?.properties?.style as string) || '';
        return (
          <FormControl id={styleSlot} key={styleSlot}>
            <FormLabel>{styleSlot}</FormLabel>
            <CssEditor
              defaultCode={defaultCode}
              onBlur={v =>
                eventBus.send(
                  'operation',
                  styleTrait
                    ? genOperation('modifyTraitProperty', {
                        componentId: component.id,
                        traitIndex: component.traits.indexOf(styleTrait),
                        properties: {
                          styleSlot,
                          style: v,
                        },
                      })
                    : genOperation('createTrait', {
                        componentId: component.id,
                        traitType: 'core/v1/style',
                        properties: {
                          styleSlot,
                          style: v,
                        },
                      })
                )
              }
            />
          </FormControl>
        );
      })}
    </VStack>
  );
};
