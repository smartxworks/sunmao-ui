import React, { useCallback, useMemo, useState } from 'react';
import produce from 'immer';
import { AddIcon, ChevronDownIcon, ChevronUpIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  IconButton,
  Text,
  Select,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react';
import { ComponentSchema } from '@sunmao-ui/core';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui/shared';
import { FontWidget, SizeWidget, ColorWidget, SpaceWidget } from '@sunmao-ui/editor-sdk';
import { capitalize } from 'lodash';
import { genOperation } from '../../../operations';
import { formWrapperCSS } from '../style';
import { EditorServices } from '../../../types';
import { CodeEditor } from '../../CodeEditor';
import { css } from '@emotion/css';

type PartialCSSProperties = Partial<Record<keyof React.CSSProperties, any>>;

type Props = {
  component: ComponentSchema;
  services: EditorServices;
};

type Styles = Array<{
  styleSlot: string;
  style: string;
  cssProperties: PartialCSSProperties;
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

  const widgetProps = useMemo(() => {
    return {
      component,
      spec: {},
      services,
      path: [],
      level: 1,
    };
  }, [component, services]);

  const styleForms = useMemo(() => {
    if (!styles) {
      return null;
    }
    return styles.map(({ style, styleSlot, cssProperties }, i) => {
      const _cssProperties = cssProperties || {};
      const removeStyle = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newStyles = styles.filter((_, j) => j !== i);
        updateStyles(newStyles);
      };

      const changeCssProperties = (newCss: PartialCSSProperties) => {
        const newCssProperties = Object.assign({}, cssProperties, newCss);
        const newStyles = produce(styles, draft => {
          draft[i].cssProperties = newCssProperties;
        });
        updateStyles(newStyles);
      };
      return (
        <AccordionItem width="full" key={`${styleSlot}${i}`}>
          <AccordionButton width="full" justifyContent="space-between">
            <span>{styleSlot}</span>
            <HStack>
              <IconButton
                aria-label="remove style"
                size="sm"
                variant="ghost"
                colorScheme="red"
                as="div"
                icon={<CloseIcon fontSize="12px" />}
                onClick={removeStyle}
              />
              <AccordionIcon />
            </HStack>
          </AccordionButton>
          <AccordionPanel bg="white" padding="0">
            <VStack
              key={`${styleSlot}-${i}`}
              className={formWrapperCSS}
              width="full"
              spacing="2"
            >
              <CollapsibleFormControl label="Style Slot">
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
              </CollapsibleFormControl>
              <CollapsibleFormControl label="Size">
                <SizeWidget
                  {...widgetProps}
                  value={_cssProperties}
                  onChange={changeCssProperties}
                />
              </CollapsibleFormControl>
              <CollapsibleFormControl label="Space">
                <SpaceWidget
                  {...widgetProps}
                  value={{
                    margin: [
                      _cssProperties.marginTop,
                      _cssProperties.marginRight,
                      _cssProperties.marginBottom,
                      _cssProperties.marginLeft,
                    ],
                    padding: [
                      _cssProperties.paddingTop,
                      _cssProperties.paddingRight,
                      _cssProperties.paddingBottom,
                      _cssProperties.paddingLeft,
                    ],
                  }}
                  onChange={(v: string, direction: string, type: string) => {
                    const key = `${type}${capitalize(direction)}`;
                    changeCssProperties({
                      ..._cssProperties,
                      [key]: v,
                    });
                  }}
                />
              </CollapsibleFormControl>
              <CollapsibleFormControl label="Font">
                <FontWidget
                  value={_cssProperties || {}}
                  onChange={changeCssProperties}
                  {...widgetProps}
                />
              </CollapsibleFormControl>
              <CollapsibleFormControl label="Color">
                <Box mb="8px">
                  <Text mb="8px">Text Color</Text>
                  <ColorWidget
                    {...widgetProps}
                    value={_cssProperties.color || ''}
                    onChange={(color: string) =>
                      changeCssProperties({ ..._cssProperties, color })
                    }
                  />
                </Box>
                <Box mb="8px">
                  <Text mb="8px">Background Color</Text>
                  <ColorWidget
                    {...widgetProps}
                    value={_cssProperties.backgroundColor || ''}
                    onChange={(color: string) =>
                      changeCssProperties({ ..._cssProperties, backgroundColor: color })
                    }
                  />
                </Box>
              </CollapsibleFormControl>
              <CollapsibleFormControl label="CSS">
                <CodeEditor
                  className={css`
                    width: 100%;
                    height: 120px;
                  `}
                  mode="css"
                  defaultCode={style}
                  onBlur={v => changeStyleContent(i, v)}
                  needRerenderAfterMount
                />
              </CollapsibleFormControl>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      );
    });
  }, [
    styles,
    styleSlots,
    widgetProps,
    updateStyles,
    changeStyleSlot,
    changeStyleContent,
  ]);

  return (
    <VStack width="full" alignItems="self-start" spacing="2">
      <Accordion width="full" defaultIndex={[0]} allowMultiple reduceMotion>
        {styleForms}
      </Accordion>
      <Button
        leftIcon={<AddIcon />}
        colorScheme="blue"
        size="sm"
        variant="ghost"
        onClick={onClickCreate}
      >
        Add Style
      </Button>
    </VStack>
  );
};

const CollapsibleFormControl: React.FC<{ label: string }> = props => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <FormControl>
      <FormLabel marginInlineEnd="0">
        <HStack width="full" justify="space-between">
          <Text fontSize="14px" fontWeight="normal">
            {props.label}
          </Text>
          <IconButton
            aria-label="toggle collapse"
            size="sm"
            variant="ghost"
            icon={
              isCollapsed ? (
                <ChevronDownIcon fontSize="20px" />
              ) : (
                <ChevronUpIcon fontSize="20px" />
              )
            }
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        </HStack>
      </FormLabel>
      {isCollapsed ? props.children : null}
    </FormControl>
  );
};
