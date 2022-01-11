import { useCallback, useMemo } from 'react';
import {
  FormControl,
  FormLabel,
  VStack,
  HStack,
  IconButton,
  Text,
  Select,
} from '@chakra-ui/react';
import { ComponentSchema } from '@sunmao-ui/core';
import { Registry } from '@sunmao-ui/runtime';
import { CssEditor } from '../../../components/CodeEditor';
import { eventBus } from '../../../eventBus';
import { genOperation } from '../../../operations';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import produce from 'immer';
import { formWrapperCSS } from '../style';

type Props = {
  registry: Registry;
  component: ComponentSchema;
};

type Styles = Array<{
  styleSlot: string;
  style: string;
}>;

export const StyleTraitForm: React.FC<Props> = props => {
  const { component, registry } = props;

  const styleSlots = useMemo(() => {
    return registry.getComponentByType(component.type).spec.styleSlots;
  }, [component, registry]);

  const styleTraitIndex = useMemo(() => {
    return component.traits.findIndex(t => t.type === 'core/v1/style');
  }, [component]);

  const styleTrait = component.traits[styleTraitIndex];
  const styles = (styleTrait?.properties.styles as Styles) || [];

  const createStyleTrait = () => {
    eventBus.send(
      'operation',
      genOperation('createTrait', {
        componentId: component.id,
        traitType: 'core/v1/style',
        properties: {
          styles: [
            {
              styleSlot: styleSlots[0],
              style: '',
            },
          ],
        },
      })
    );
  };

  const updateStyles = useCallback(
    (newStyles: Styles) => {
      eventBus.send(
        'operation',
        genOperation('modifyTraitProperty', {
          componentId: component.id,
          traitIndex: styleTraitIndex,
          properties: {
            styles: newStyles,
          },
        })
      );
    },
    [component, styleTraitIndex]
  );

  const addStyle = useCallback(() => {
    const newStyles: Styles = styles.concat({
      styleSlot: styleSlots[0],
      style: '',
    });
    updateStyles(newStyles);
  }, [updateStyles, styleSlots, styles]);

  const onClickCreate = () => {
    if (!styleTrait) {
      createStyleTrait();
    } else {
      addStyle();
    }
  };

  const changeStyleContent = useCallback(
    (i: number, value: string) => {
      const newStyles = produce(styles, draft => {
        draft[i].style = value;
      });
      updateStyles(newStyles);
    },
    [updateStyles, styles]
  );

  const changeStyleSlot = useCallback(
    (i: number, newSlot: string) => {
      const newStyles = produce(styles, draft => {
        draft[i].styleSlot = newSlot;
      });
      updateStyles(newStyles);
    },
    [updateStyles, styles]
  );

  const styleForms = useMemo(
    () =>
      styles.map(({ style, styleSlot }, i) => {
        if (styles.length === 0) {
          return null;
        }
        const removeStyle = () => {
          const newStyles = styles.filter((_, j) => j !== i);
          updateStyles(newStyles);
        };
        return (
          <VStack key={`${styleSlot}-${i}`} css={formWrapperCSS} spacing="2">
            <FormControl id={styleSlot}>
              <FormLabel marginInlineEnd="0">
                <HStack width="full" justify="space-between">
                  <Text>Style Slot</Text>
                  <IconButton
                    aria-label="remove style"
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    icon={<CloseIcon />}
                    onClick={removeStyle}
                  />
                </HStack>
              </FormLabel>
              <Select
                value={styleSlot}
                onChange={e => changeStyleSlot(i, e.target.value)}
              >
                {styleSlots.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </FormControl>
            <CssEditor defaultCode={style} onBlur={v => changeStyleContent(i, v)} />
          </VStack>
        );
      }),
    [styles, changeStyleContent, changeStyleSlot, updateStyles]
  );

  return (
    <VStack width="full">
      <HStack width="full" justify="space-between">
        <strong>Styles</strong>
        <IconButton
          aria-label="Styles"
          size="sm"
          variant="ghost"
          colorScheme="blue"
          icon={<AddIcon />}
          onClick={onClickCreate}
        />
      </HStack>
      {styleForms}
    </VStack>
  );
};
