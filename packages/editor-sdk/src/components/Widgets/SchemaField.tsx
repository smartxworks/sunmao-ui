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
import { isExpression as _isExpression } from '../../utils/validator';
import { WidgetProps } from '../../types/widget';
import {
  implementWidget,
  mergeWidgetOptionsIntoSchema,
  shouldDisplayLabel,
  getCodeMode,
} from '../../utils/widget';
import { ExpressionWidget, ExpressionWidgetOptionsSchema } from './ExpressionWidget';
import { StringField } from './StringField';
import { ObjectField } from './ObjectField';
import { ArrayField } from './ArrayField';
import { BooleanField } from './BooleanField';
import { NumberField } from './NumberField';
import { NullField } from './NullField';
import { MultiSchemaField } from './MultiSchemaField';
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
  setIsExpression?: (v: boolean) => void;
};

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
    return <div className="hidden">{children}</div>;
  }

  return (
    <FormControl isRequired={required} id={id} mt={displayLabel ? 1 : 0}>
      {displayLabel && (
        <Tooltip label={description} placement="auto-start">
          <FormLabel>
            {label}
            {codeMode && (
              <ExpressionButton
                isExpression={isExpression}
                setIsExpression={setIsExpression}
              />
            )}
          </FormLabel>
        </Tooltip>
      )}
      {children}
      {errors && <FormErrorMessage>{errors}</FormErrorMessage>}
      {help && <FormHelperText>{help}</FormHelperText>}
    </FormControl>
  );
};

export const SchemaFieldWidgetOptions = Type.Object({
  isDisplayLabel: Type.Optional(Type.Boolean()),
  isShowAsideExpressionButton: Type.Optional(Type.Boolean()),
  expressionOptions: Type.Optional(ExpressionWidgetOptionsSchema),
});

type SchemaFieldWidgetOptionsType = Static<typeof SchemaFieldWidgetOptions>;

export const SchemaField: React.FC<WidgetProps<SchemaFieldWidgetOptionsType>> = props => {
  const { component, schema, level, value, services, onChange } = props;
  const { title, widgetOptions } = schema;
  const { isShowAsideExpressionButton, expressionOptions } = widgetOptions || {};
  const label = title ?? '';
  const {
    widgetManager,
  } = services;
  const [isExpression, setIsExpression] = useState(() => _isExpression(value));
  const isDisplayLabel =
    widgetOptions?.isDisplayLabel !== false && shouldDisplayLabel(schema, label);
  const codeMode = getCodeMode(schema);

  if (isEmpty(schema)) {
    return null;
  }

  let Component: React.FC<WidgetProps<any>> = UnsupportedField;
  let showAsideExpressionButton =
    isShowAsideExpressionButton && !isDisplayLabel && codeMode;

  // customize widgets
  if (isExpression) {
    Component = ExpressionWidget;
  } else if (schema.widget) {
    const widget = widgetManager.getWidget(schema.widget);

    if (widget) {
      Component = widget.impl;
    }
  } else if (level === 0) {
    Component = CategoryWidget;
    showAsideExpressionButton = false;
  }
  // type fields
  else if (schema.type === 'object') {
    Component = ObjectField;
    showAsideExpressionButton = false;
  } else if (schema.type === 'string') {
    Component = StringField;
  } else if (schema.type === 'array') {
    Component = ArrayField;
    showAsideExpressionButton = false;
  } else if (schema.type === 'boolean') {
    Component = BooleanField;
  } else if (schema.type === 'integer' || schema.type === 'number') {
    Component = NumberField;
  } else if (schema.type === 'null') {
    Component = NullField;
  } else if ('anyOf' in schema || 'oneOf' in schema) {
    Component = MultiSchemaField;
  } else if (
    [AnyKind, UnknownKind].includes((schema as unknown as { kind: symbol }).kind)
  ) {
    Component = ExpressionWidget;
  } else {
    console.info('Found unsupported schema', schema);
  }

  return (
    <DefaultTemplate
      label={label}
      description={schema.description}
      displayLabel={isDisplayLabel}
      codeMode={codeMode}
      isExpression={isExpression}
      setIsExpression={setIsExpression}
    >
      <HStack>
        <Box flex={schema.type === 'boolean' && isExpression === false ? '' : 1}>
          <Component
            component={component}
            schema={
              isExpression
                ? mergeWidgetOptionsIntoSchema(schema, {
                    compactOptions: expressionOptions?.compactOptions,
                  })
                : schema
            }
            value={value}
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
    </DefaultTemplate>
  );
};

export default implementWidget<SchemaFieldWidgetOptionsType>({
  version: 'core/v1',
  metadata: {
    name: 'SchemaField',
  },
  spec: {
    options: SchemaFieldWidgetOptions,
  },
})(SchemaField);
