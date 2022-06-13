import React, { useState } from 'react';
import {
  HStack,
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Button,
  Tooltip,
} from '@chakra-ui/react';
import { isEmpty } from 'lodash-es';
import { AnyKind, UnknownKind, Type, Static } from '@sinclair/typebox';
import { css } from '@emotion/css';
import { CORE_VERSION, CoreWidgetName } from '@sunmao-ui/shared';
import { isExpression as _isExpression } from '../../utils/validator';
import { WidgetProps } from '../../types/widget';
import {
  implementWidget,
  mergeWidgetOptionsIntoSpec,
  shouldDisplayLabel,
  getCodeMode,
} from '../../utils/widget';
import { ExpressionWidget, ExpressionWidgetOptionsSpec } from './ExpressionWidget';
import { StringField } from './StringField';
import { ObjectField } from './ObjectField';
import { ArrayField } from './ArrayField';
import { BooleanField } from './BooleanField';
import { NumberField } from './NumberField';
import { NullField } from './NullField';
import { MultiSpecField } from './MultiSpecField';
import { CategoryWidget } from './CategoryWidget';
import { UnsupportedField } from './UnsupportedField';

type ExpressionButtonProps = {
  isExpression?: boolean;
  setIsExpression?: (v: boolean) => void;
};

const ExpressionButton: React.FC<ExpressionButtonProps> = props => {
  const { isExpression, setIsExpression } = props;

  return (
    <Button
      size="xs"
      ml="2"
      colorScheme="blue"
      variant={isExpression ? 'solid' : 'outline'}
      onClick={() => setIsExpression?.(!isExpression)}
      borderWidth={1}
      borderColor={isExpression ? 'blue.500' : ''}
    >
      JS
    </Button>
  );
};

type TemplateProps = {
  id?: string;
  label?: string;
  errors?: React.ReactElement;
  help?: string;
  description?: string;
  hidden?: boolean;
  required?: boolean;
  displayLabel?: boolean;
  codeMode?: boolean;
  isExpression?: boolean;
  children: {
    title?: any;
    content: any;
  };
  setIsExpression?: (v: boolean) => void;
};

const FormControlStyle = css`
  &:not(:last-of-type) {
    margin-bottom: var(--chakra-space-2);
  }
`;

const LabelStyle = css`
  font-weight: normal;
  font-size: 14px;
`;

const DefaultTemplate: React.FC<TemplateProps> = props => {
  const {
    id,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    required,
    displayLabel,
    codeMode,
    isExpression,
    setIsExpression,
  } = props;

  if (hidden) {
    return <div className="hidden">{children.content}</div>;
  }

  return (
    <FormControl className={FormControlStyle} isRequired={required} id={id}>
      {displayLabel && (
        <Tooltip label={description} placement="auto-start">
          <FormLabel display="flex" alignItems="center">
            <span className={LabelStyle}>{children.title || label}</span>
            {codeMode && (
              <ExpressionButton
                isExpression={isExpression}
                setIsExpression={setIsExpression}
              />
            )}
          </FormLabel>
        </Tooltip>
      )}
      {children.content}
      {errors && <FormErrorMessage>{errors}</FormErrorMessage>}
      {help && <FormHelperText>{help}</FormHelperText>}
    </FormControl>
  );
};

export const SchemaFieldWidgetOptions = Type.Object({
  isDisplayLabel: Type.Optional(Type.Boolean()),
  isShowAsideExpressionButton: Type.Optional(Type.Boolean()),
  expressionOptions: Type.Optional(ExpressionWidgetOptionsSpec),
  isHidden: Type.Optional(Type.Boolean()),
});

type SchemaFieldWidgetOptionsType = Static<typeof SchemaFieldWidgetOptions>;
type Props = WidgetProps<SchemaFieldWidgetOptionsType> & {
  children?:
    | (React.ReactNode & {
        title?: any;
      })
    | null;
};

export const SpecWidget: React.FC<Props> = props => {
  const { component, spec, level, path, value, services, children, onChange } = props;
  const { title, widgetOptions } = spec;
  const { isShowAsideExpressionButton, expressionOptions, isHidden } =
    widgetOptions || {};
  const label = title ?? '';
  const { widgetManager } = services;
  const [isExpression, setIsExpression] = useState(() => _isExpression(value));
  const isDisplayLabel =
    widgetOptions?.isDisplayLabel !== false && shouldDisplayLabel(spec, label);
  const codeMode = getCodeMode(spec);

  if (isEmpty(spec) || isHidden) {
    return null;
  }

  let Component: React.ComponentType<WidgetProps<any>> = UnsupportedField;
  let showAsideExpressionButton =
    isShowAsideExpressionButton && !isDisplayLabel && codeMode;
  const widget = widgetManager.getWidget(spec.widget || '');

  // customize widgets
  if (isExpression) {
    Component = ExpressionWidget;
  } else if (widget) {
    Component = widget.impl;
  } else if (level === 0) {
    Component = CategoryWidget;
    showAsideExpressionButton = false;
  }
  // type fields
  else if (spec.type === 'object') {
    Component = ObjectField;
    showAsideExpressionButton = false;
  } else if (spec.type === 'string') {
    Component = StringField;
  } else if (spec.type === 'array') {
    Component = ArrayField;
    showAsideExpressionButton = false;
  } else if (spec.type === 'boolean') {
    Component = BooleanField;
  } else if (spec.type === 'integer' || spec.type === 'number') {
    Component = NumberField;
  } else if (spec.type === 'null') {
    Component = NullField;
  } else if ('anyOf' in spec || 'oneOf' in spec) {
    Component = MultiSpecField;
  } else if (
    [AnyKind, UnknownKind].includes((spec as unknown as { kind: symbol }).kind)
  ) {
    Component = ExpressionWidget;
  } else {
    console.info('Found unsupported spec', spec);
  }

  return (
    <DefaultTemplate
      label={label}
      description={spec.description}
      displayLabel={isDisplayLabel}
      codeMode={codeMode}
      isExpression={isExpression}
      setIsExpression={setIsExpression}
    >
      {{
        title: children instanceof Object ? children.title : null,
        content: (
          <HStack>
            <Box
              flex={spec.type === 'boolean' && isExpression === false ? '' : 1}
              maxWidth="100%"
            >
              <Component
                component={component}
                spec={
                  isExpression
                    ? mergeWidgetOptionsIntoSpec(spec, {
                        compactOptions: expressionOptions?.compactOptions,
                      })
                    : spec
                }
                value={value}
                path={path}
                level={level}
                services={services}
                onChange={onChange}
              />
            </Box>
            {showAsideExpressionButton ? (
              <ExpressionButton
                isExpression={isExpression}
                setIsExpression={setIsExpression}
              />
            ) : null}
          </HStack>
        ),
      }}
    </DefaultTemplate>
  );
};

export default implementWidget<SchemaFieldWidgetOptionsType>({
  version: CORE_VERSION,
  metadata: {
    name: CoreWidgetName.Spec,
  },
  spec: {
    options: SchemaFieldWidgetOptions,
  },
})(SpecWidget);
