import React, { useCallback, useMemo } from 'react';
import produce from 'immer';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
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
import { CssEditor } from '../../../components/CodeEditor';
import { genOperation } from '../../../operations';
import { formWrapperCSS } from '../style';
import { EditorServices } from '../../../types';

type Props = {
  component: ComponentSchema;
  services: EditorServices;
};

type Styles = Array<{
  styleSlot: string;
  style: string;
}>;

export const StyleTraitForm: React.FC<Props> = props => {
  const { component, services } = props;
  const { eventBus, registry } = services;

  const styleSlots = useMemo(() => {
    return registry.getComponentByType(component.type).spec.styleSlots;
  }, [component, registry]);

  const styleTraitIndex = useMemo(() => {
    return component.traits.findIndex(t => t.type === 'core/v1/style');
  }, [component]);

  const styleTrait = component.traits[styleTraitIndex];
  const styles = styleTrait?.properties.styles as Styles | undefined;

  const createStyleTrait = () => {
    eventBus.send(
      'operation',
      genOperation(registry, 'createTrait', {
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
        genOperation(registry, 'modifyTraitProperty', {
          componentId: component.id,
          traitIndex: styleTraitIndex,
          properties: {
            styles: newStyles,
          },
        })
      );
    },
    [component.id, eventBus, registry, styleTraitIndex]
  );

  const addStyle = useCallback(() => {
    const newStyles: Styles = (styles || []).concat({
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
      if (!styles) return;
      const newStyles = produce(styles, draft => {
        draft[i].style = value;
      });
      updateStyles(newStyles);
    },
    [updateStyles, styles]
  );

  const changeStyleSlot = useCallback(
    (i: number, newSlot: string) => {
      if (!styles) return;
      const newStyles = produce(styles, draft => {
        draft[i].styleSlot = newSlot;
      });
      updateStyles(newStyles);
    },
    [updateStyles, styles]
  );

  const styleForms = useMemo(() => {
    if (!styles) {
      return null;
    }
    return styles.map(({ style, styleSlot }, i) => {
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
            <Select value={styleSlot} onChange={e => changeStyleSlot(i, e.target.value)}>
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
    });
  }, [styles, styleSlots, updateStyles, changeStyleSlot, changeStyleContent]);

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
