import {
  Button,
  Popover,
  Checkbox,
  PopoverContent,
  chakra,
  PopoverTrigger,
  createIcon,
} from '@chakra-ui/react';
import React from 'react';

const FilterIcon = createIcon({
  displayName: 'FilterIcon',
  viewBox: '0 0 24 24',
  path: [
    <path
      key="Stroke 1"
      id="Stroke 1"
      d="M11.1437 17.8829H4.67114"
      stroke="#130F26"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    <path
      key="Stroke 3"
      id="Stroke 3"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.205 17.8839C15.205 19.9257 15.8859 20.6057 17.9267 20.6057C19.9676 20.6057 20.6485 19.9257 20.6485 17.8839C20.6485 15.8421 19.9676 15.1621 17.9267 15.1621C15.8859 15.1621 15.205 15.8421 15.205 17.8839Z"
      stroke="#130F26"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    <path
      key="Stroke 5"
      id="Stroke 5"
      d="M14.1765 7.39439H20.6481"
      stroke="#130F26"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
    <path
      key="Stroke 7"
      id="Stroke 7"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.1153 7.39293C10.1153 5.35204 9.43436 4.67114 7.39346 4.67114C5.35167 4.67114 4.67078 5.35204 4.67078 7.39293C4.67078 9.43472 5.35167 10.1147 7.39346 10.1147C9.43436 10.1147 10.1153 9.43472 10.1153 7.39293Z"
      stroke="#130F26"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />,
  ],
});

type FilterProps = {
  options: string[];
  checkedOptions: string[];
  onChange: (v: string[]) => void;
};

export const ComponentFilter: React.FC<FilterProps> = ({
  options,
  checkedOptions,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const value = e.target.value;
    const newCheckedOptions = [...checkedOptions];
    if (checked) {
      newCheckedOptions.push(value);
    } else {
      const idx = newCheckedOptions.findIndex(c => c === value);
      newCheckedOptions.splice(idx, 1);
    }
    onChange(newCheckedOptions);
  };

  const checkVersion = (version: string) => {
    return checkedOptions.includes(version);
  };

  return (
    <Popover isLazy closeOnBlur placement="bottom">
      <PopoverTrigger>
        <Button
          _focus={{ boxShadow: 'none' }}
          colorScheme="blue"
          variant={checkedOptions.length > 0 ? 'solid' : 'ghost'}
          h="1.75rem"
          size="sm"
        >
          <FilterIcon />
        </Button>
      </PopoverTrigger>
      <chakra.div
        sx={{
          '.chakra-popover__popper': {
            inset: '0px auto auto -3px !import',
          },
        }}
      >
        <PopoverContent
          mt="1"
          p="2"
          opacity="0"
          rounded="md"
          maxH="350px"
          shadow="base"
          zIndex="popover"
          overflowY="auto"
          width="200px"
          _focus={{ boxShadow: 'none' }}
        >
          {options.map(version => {
            return (
              <Checkbox
                key={version}
                value={version}
                isChecked={checkVersion(version)}
                onChange={handleChange}
              >
                {version}
              </Checkbox>
            );
          })}
        </PopoverContent>
      </chakra.div>
    </Popover>
  );
};
