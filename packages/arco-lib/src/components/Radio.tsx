import { Radio as BaseRadio } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { RadioPropsSpec as BaseRadioPropsSpec } from '../generated/types/Radio';
import { useEffect, useState } from 'react';

const RadioPropsSpec = Type.Object({
  ...BaseRadioPropsSpec,
});
const RadioStateSpec = Type.Object({
  checkedValue: Type.String(),
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
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'radio',
    displayName: 'Radio',
    exampleProperties,
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: RadioPropsSpec,
    state: RadioStateSpec,
    methods: {
      setCheckedValue: Type.Object({
        value: Type.String(),
      }),
    },
    slots: [],
    styleSlots: ['group'],
    events: ['onChange'],
  },
};

export const Radio = implementRuntimeComponent(options)(props => {
  const { customStyle, callbackMap, mergeState, subscribeMethods, elementRef } = props;
  const { defaultCheckedValue, ...cProps } = getComponentProps(props);
  const [checkedValue, setCheckedValue] = useState<string>('');
  const [isInit, setIsInit] = useState(false);

  const onChange = (value: string) => {
    setCheckedValue(value);
    mergeState({ checkedValue: value });
    callbackMap?.onChange?.();
  };

  useEffect(() => {
    if (!isInit && defaultCheckedValue) {
      setCheckedValue(defaultCheckedValue);
      mergeState({ checkedValue: defaultCheckedValue });
    }

    setIsInit(true);
  }, [defaultCheckedValue, isInit, mergeState]);
  useEffect(() => {
    subscribeMethods({
      setCheckedValue: ({ value: newCheckedValue }) => {
        setCheckedValue(newCheckedValue);
        mergeState({
          checkedValue: newCheckedValue,
        });
      },
    });
  }, [mergeState, subscribeMethods]);

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
