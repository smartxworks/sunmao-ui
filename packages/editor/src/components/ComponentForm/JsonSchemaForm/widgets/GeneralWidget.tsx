import React from 'react';
import { FieldProps } from '../fields';
import { SchemaEditor } from 'components/CodeEditor';

type Props = FieldProps;

const GeneralWidget: React.FC<Props> = props => {
  const { formData, onChange } = props;

  return (
    <SchemaEditor
      defaultCode={String(formData)}
      lineNumbers={false}
      onBlur={v => {
        onChange(v);
      }}
    />
  );
};

export default GeneralWidget;
