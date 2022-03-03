import React, { useCallback } from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import { Switch } from '../UI';

export const BooleanField: React.FC<WidgetProps> = props => {
  const { value, onChange } = props;
  const onValueChange = useCallback((event)=> {
    onChange(event.currentTarget.checked);
  }, []);

  return (
    <Switch isChecked={value} onChange={onValueChange} />
  );
};

export default implementWidget({
  version: 'core/v1',
  metadata: {
    name: 'BooleanField',
  },
})(BooleanField);
