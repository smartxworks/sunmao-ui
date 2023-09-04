import React, { useMemo } from 'react';
import { EditorServices } from '../../types';
import { css } from '@emotion/css';
import { observer } from 'mobx-react-lite';
import { ComponentSchema } from '@sunmao-ui/core';
import { Select } from '@sunmao-ui/editor-sdk';
import { ComponentFilter } from '../ComponentsList/ComponentFilter';
import { HStack } from '@chakra-ui/react';
type Props = {
  components: ComponentSchema[];
  onChange: (id: string) => void;
  tags: string[];
  checkedTags: string[];
  onTagsChange: (v: string[]) => void;
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
  const { components, onChange, tags, checkedTags, onTagsChange } = props;

  const options = useMemo(() => {
    return components.map(c => ({
      label: c.id,
      value: c.id,
    }));
  }, [components]);

  return (
    <HStack width="full">
      <Select
        bordered={false}
        className={SelectStyle}
        placeholder="Search component"
        onSelect={onChange}
        showArrow={false}
        showSearch
        style={{ width: '100%' }}
        options={options}
      />
      {tags.length > 0 ? (
        <ComponentFilter
          options={tags}
          checkedOptions={checkedTags}
          onChange={v => onTagsChange(v)}
        />
      ) : null}
    </HStack>
  );
});
