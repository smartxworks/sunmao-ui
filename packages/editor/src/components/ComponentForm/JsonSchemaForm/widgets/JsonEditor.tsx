import React, { useMemo } from 'react';
import { FieldProps } from '../fields';
import { SchemaEditor } from '../../../../components/CodeEditor';

type Props = FieldProps;

const JsonEditor: React.FC<Props> = props => {
  const { formData, onChange } = props;
  const value = useMemo(() => {
    try {
      if (typeof formData === 'string') {
        return formData;
      }
      return JSON.stringify(formData);
    } catch {
      return '{}';
    }
  }, [formData]);

  return (
    <SchemaEditor
      defaultCode={value}
      lineNumbers={false}
      onBlur={v => {
        try {
          onChange(JSON.parse(v));
        } catch {
          onChange(v);
        }
      }}
    />
  );
};

export default JsonEditor;
