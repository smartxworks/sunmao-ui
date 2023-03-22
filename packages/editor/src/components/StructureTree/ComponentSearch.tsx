import React, { useMemo } from 'react';
import { EditorServices } from '../../types';
import { css } from '@emotion/css';
import { observer } from 'mobx-react-lite';
import { ComponentSchema } from '@sunmao-ui/core';
import { Select } from '@sunmao-ui/editor-sdk';
type Props = {
  components: ComponentSchema[];
  onChange: (id: string) => void;
  services: EditorServices;
};

const SelectStyle = css`
  height: 40px;
  &&& .sunmao-select-selector,
  &&& .sunmao-select-selector input {
    height: 100%;
  }
  &&& .sunmao-select-selector {
    border-radius: 0.375rem;
  }
  &&& .sunmao-select-selector .sunmao-select-selection-placeholder,
  &&& .sunmao-select-selector .sunmao-select-selection-search,
  &&& .sunmao-select-selector .sunmao-select-selection-item {
    line-height: 40px;
    font-size: 1rem;
  }
`;

export const ComponentSearch: React.FC<Props> = observer(props => {
  const { components, onChange } = props;

  const options = useMemo(() => {
    return components.map(c => ({
      label: c.id,
      value: c.id,
    }));
  }, [components]);

  return (
    <Select
      bordered={false}
      className={SelectStyle}
      placeholder="Search component"
      onChange={onChange}
      showArrow={false}
      showSearch
      style={{ width: '100%' }}
      options={options}
    />
  );
});
