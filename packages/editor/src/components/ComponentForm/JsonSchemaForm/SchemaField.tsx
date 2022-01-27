import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Text,
  Button,
  Spacer,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { isEmpty } from 'lodash-es';
import { FieldProps, getCodeMode, getDisplayLabel } from './fields';
import { widgets } from './widgets/widgets';
import StringField from './StringField';
import ObjectField from './ObjectField';
import ArrayField from './ArrayField';
import BooleanField from './BooleanField';
import NumberField from './NumberField';
import NullField from './NullField';
import MultiSchemaField from './MultiSchemaField';
import UnsupportedField from './UnsupportedField';
import { ArrowDownIcon, ArrowLeftIcon, ChevronDownIcon, ChevronLeftIcon } from '@chakra-ui/icons';

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

  const [isExpanded, setIsExpanded] = useState(true);
  if (hidden) {
    return <div className="hidden">{children}</div>;
  }

  return (
    <FormControl isRequired={required} id={id} mt="1">
      {displayLabel && (
        <>
          <FormLabel display='flex'>
            {label}
            {codeMode && (
              <Button
                size="xs"
                ml="2"
                colorScheme="blue"
                variant={isExpression ? 'solid' : 'outline'}
                onClick={() => setIsExpression?.(!isExpression)}
              >
                JS
              </Button>
            )}
            <Spacer display='inline' />
            <IconButton
              size="smx"
              variant="ghost"
              aria-label="toggle-expand"
              icon={isExpanded ? <ChevronDownIcon size /> : <ChevronLeftIcon />}
              onClick={() => setIsExpanded(prev => !prev)}
            />
          </FormLabel>
          {description && <Text fontSize="sm">{description}</Text>}
        </>
      )}
      {isExpanded ? children : null}
      {errors && <FormErrorMessage>{errors}</FormErrorMessage>}
      {help && <FormHelperText>{help}</FormHelperText>}
    </FormControl>
  );
};

type Props = FieldProps & {
  label: string;
};

const SchemaField: React.FC<Props> = props => {
  const { schema, label, formData, onChange, registry, stateManager } = props;
  const [isExpression, setIsExpression] = useState(
    // FIXME: regexp copied from FieldModel.ts, is this a stable way to check expression?
    () => typeof formData === 'string' && /.*{{.*}}.*/.test(formData)
  );

  if (isEmpty(schema)) {
    return null;
  }

  let Component = UnsupportedField;

  // customize widgets
  if (isExpression) {
    Component = widgets.expression;
  } else if (schema.widget && widgets[schema.widget]) {
    Component = widgets[schema.widget];
  }
  // type fields
  else if (schema.type === 'object') {
    Component = ObjectField;
  } else if (schema.type === 'string') {
    Component = StringField;
  } else if (schema.type === 'array') {
    Component = ArrayField;
  } else if (schema.type === 'boolean') {
    Component = BooleanField;
  } else if (schema.type === 'integer' || schema.type === 'number') {
    Component = NumberField;
  } else if (schema.type === 'null') {
    Component = NullField;
  } else if ('anyOf' in schema || 'oneOf' in schema) {
    Component = MultiSchemaField;
  } else {
    console.info('Found unsupported schema', schema);
  }

  const displayLabel = getDisplayLabel(schema, label);
  const codeMode = getCodeMode(schema);

  return (
    <DefaultTemplate
      label={label}
      displayLabel={displayLabel}
      codeMode={codeMode}
      isExpression={isExpression}
      setIsExpression={setIsExpression}
    >
      <Component
        schema={schema}
        formData={formData}
        onChange={onChange}
        registry={registry}
        stateManager={stateManager}
      />
    </DefaultTemplate>
  );
};

export default SchemaField;
