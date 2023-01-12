import { Radio as BaseRadio } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import {
  RadioPropsSpec as BaseRadioPropsSpec,
  radioValueType,
} from '../generated/types/Radio';
import { useEffect } from 'react';
import { useStateValue } from '../hooks/useStateValue';

const RadioPropsSpec = Type.Object({
  ...BaseRadioPropsSpec,
});
const RadioStateSpec = Type.Object({
  checkedValue: Type.Union(radioValueType),
});

const exampleProperties: Static<typeof RadioPropsSpec> = {
  options: [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b' },
    { label: 'C', value: 'c' },
  ],
  type: 'radio',
  defaultCheckedValue: 'a',
  direction: 'horizontal',
  size: 'default',
  updateWhenDefaultValueChanges: false,
};

export const Radio = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'radio',
    displayName: 'Radio',
    exampleProperties,
    annotations: {
      category: 'Data Entry',
    },
  },
  spec: {
    properties: RadioPropsSpec,
    state: RadioStateSpec,
    methods: {
      setCheckedValue: Type.Object({
        value: Type.Union(radioValueType, {
          widget: 'core/v1/expression',
        }),
      }),
    },
    slots: {},
    styleSlots: ['group'],
    events: ['onChange'],
  },
})(props => {
  const { customStyle, callbackMap, mergeState, subscribeMethods, elementRef } = props;
  const { defaultCheckedValue, updateWhenDefaultValueChanges, ...cProps } =
    getComponentProps(props);
  const [checkedValue, setCheckedValue] = useStateValue(
    defaultCheckedValue,
    mergeState,
    updateWhenDefaultValueChanges,
    'checkedValue'
  );

  const onChange = (value: string) => {
    setCheckedValue(value);
    mergeState({ checkedValue: value });
    callbackMap?.onChange?.();
  };

  useEffect(() => {
    subscribeMethods({
      setCheckedValue: ({ value: newCheckedValue }) => {
        setCheckedValue(newCheckedValue);
        mergeState({
          checkedValue: newCheckedValue,
        });
      },
    });
  }, [mergeState, setCheckedValue, subscribeMethods]);

  return (
    <div ref={elementRef}>
      <BaseRadio.Group
        {...cProps}
        className={css(customStyle?.group)}
        value={checkedValue}
        onChange={onChange}
      />
    </div>
  );
});
