import React, { useMemo, useCallback } from 'react';
import { EditorServices } from '../../types';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  type Item,
} from '@choc-ui/chakra-autocomplete';
import { css } from '@emotion/css';
import { observer } from 'mobx-react-lite';
import { ComponentSchema } from '@sunmao-ui/core';
type Props = {
  components: ComponentSchema[];
  onChange: (id: string) => void;
  services: EditorServices;
};

const AutoCompleteStyle = css`
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

export const ComponentSearch: React.FC<Props> = observer(props => {
  const { components, onChange } = props;

  const onSelectOption = useCallback(
    ({ item }: { item: Item }) => {
      onChange(item.value);
    },
    [onChange]
  );

  const options = useMemo(() => {
    return components.map(c => {
      return (
        <AutoCompleteItem key={c.id} value={c.id}>
          {c.id}
        </AutoCompleteItem>
      );
    });
  }, [components]);

  return (
    <AutoComplete
      openOnFocus
      lazy
      onSelectOption={onSelectOption}
      className={AutoCompleteStyle}
      maxSuggestions={20}
    >
      <AutoCompleteInput
        placeholder="Search component"
        autoComplete="off"
        size="md"
        variant="filled"
        marginTop={0}
      />
      <AutoCompleteList>{options}</AutoCompleteList>
    </AutoComplete>
  );
});
