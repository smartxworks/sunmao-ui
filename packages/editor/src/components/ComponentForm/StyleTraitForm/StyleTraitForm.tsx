import React, { useCallback, useMemo, useState } from 'react';
import produce from 'immer';
import { AddIcon, ChevronDownIcon, ChevronUpIcon, CloseIcon } from '@chakra-ui/icons';
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
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui/shared';
import { SizeField } from '@sunmao-ui/editor-sdk';

type Props = {
  component: ComponentSchema;
  services: EditorServices;
};

type Styles = Array<{
  styleSlot: string;
  style: string;
  cssProperties: React.CSSProperties;
}>;

const STYLE_TRAIT_TYPE = `${CORE_VERSION}/${CoreTraitName.Style}`;

export const StyleTraitForm: React.FC<Props> = props => {
  const { component, services } = props;
  const { eventBus, registry } = services;

  const styleSlots = useMemo(() => {
    return registry.getComponentByType(component.type).spec.styleSlots;
  }, [component, registry]);

  const styleTraitIndex = useMemo(() => {
    return component.traits.findIndex(t => t.type === STYLE_TRAIT_TYPE);
  }, [component]);

  const styleTrait = component.traits[styleTraitIndex];
  const styles = styleTrait?.properties.styles as Styles | undefined;

  const createStyleTrait = () => {
    eventBus.send(
      'operation',
      genOperation(registry, 'createTrait', {
        componentId: component.id,
        traitType: STYLE_TRAIT_TYPE,
        properties: {
          styles: [
            {
              styleSlot: styleSlots[0],
              style: '',
              cssProperties: {},
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
      cssProperties: {},
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
    return styles.map(({ style, styleSlot, cssProperties }, i) => {
      const _cssProperties = cssProperties || {};
      const removeStyle = () => {
        const newStyles = styles.filter((_, j) => j !== i);
        updateStyles(newStyles);
      };

      const changeCssProperties = (newCss: React.CSSProperties) => {
        const newCssProperties = Object.assign({}, style, newCss);
        const newStyles = produce(styles, draft => {
          draft[i].cssProperties = newCssProperties;
        });
        updateStyles(newStyles);
      };
      return (
        <VStack key={`${styleSlot}-${i}`} css={formWrapperCSS} width="full" spacing="2">
          <HStack width="full" justify="space-between">
            <Text>{styleSlot}</Text>
            <IconButton
              aria-label="remove style"
              size="sm"
              variant="ghost"
              colorScheme="red"
              icon={<CloseIcon />}
              onClick={removeStyle}
            />
          </HStack>
          <CollapsibleFormControl label="Style Slot">
            <Select value={styleSlot} onChange={e => changeStyleSlot(i, e.target.value)}>
              {styleSlots.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </CollapsibleFormControl>
          <CollapsibleFormControl label="Size">
            <SizeField value={_cssProperties || {} as any} onChange={changeCssProperties} />
          </CollapsibleFormControl>
          <CollapsibleFormControl label="CSS">
            <CssEditor defaultCode={style} onBlur={v => changeStyleContent(i, v)} />
          </CollapsibleFormControl>
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

const CollapsibleFormControl: React.FC<{ label: string }> = props => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <FormControl>
      <FormLabel marginInlineEnd="0">
        <HStack width="full" justify="space-between">
          <Text>{props.label}</Text>
          <IconButton
            aria-label="toggle collapse"
            size="sm"
            variant="ghost"
            icon={isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        </HStack>
      </FormLabel>
      {isCollapsed ? props.children : null}
    </FormControl>
  );
};
