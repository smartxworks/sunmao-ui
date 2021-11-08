import React from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react';
import { FieldProps, getDisplayLabel } from './fields';
import StringField from './StringField';
import ObjectField from './ObjectField';
import UnsupportedField from './UnsupportedField';

type TemplateProps = {
  id?: string;
  label?: string;
  errors?: React.ReactElement;
  help?: string;
  description?: string;
  hidden?: boolean;
  required?: boolean;
  displayLabel?: boolean;
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
  } = props;
  if (hidden) {
    return <div className="hidden">{children}</div>;
  }

  return (
    <FormControl isRequired={required} id={id}>
      {displayLabel && (
        <>
          <FormLabel>{label}</FormLabel>
          {description && <Text fontSize="sm">{description}</Text>}
        </>
      )}
      {children}
      {errors && <FormErrorMessage>{errors}</FormErrorMessage>}
      {help && <FormHelperText>{help}</FormHelperText>}
    </FormControl>
  );
};

type Props = FieldProps & {
  label: string;
};

const SchemaField: React.FC<Props> = props => {
  const { schema, label, formData, onChange } = props;

  let Component = UnsupportedField;

  if (schema.type === 'object') {
    Component = ObjectField;
  } else if (schema.type === 'string') {
    Component = StringField;
  }

  const displayLabel = getDisplayLabel(schema, label);

  return (
    <DefaultTemplate label={label} displayLabel={displayLabel}>
      <Component schema={schema} formData={formData} onChange={onChange} />
    </DefaultTemplate>
  );
};

export default SchemaField;
