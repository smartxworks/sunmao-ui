import { Mentions as BaseMentions } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { MentionsPropsSpec as BaseMentionsPropsSpec } from '../generated/types/Mentions';
import { useCallback } from 'react';
import { useStateValue } from '../hooks/useStateValue';

const MentionsPropsSpec = Type.Object(BaseMentionsPropsSpec);
const MentionsStateSpec = Type.Object({
  value: Type.String(),
});

const exampleProperties: Static<typeof MentionsPropsSpec> = {
  defaultValue: 'option1',
  options: ['option1', 'option2', 'option3'],
  prefix: '@',
  position: 'bl',
  split: ' ',
  error: false,
  allowClear: true,
  disabled: false,
  placeholder: 'you can mentions sb by prefix "@"',
  updateWhenDefaultValueChanges: false,
};

export const Mentions = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'mentions',
    displayName: 'Mentions',
    exampleProperties,
    annotations: {
      category: 'Data Entry',
    },
  },
  spec: {
    properties: MentionsPropsSpec,
    state: MentionsStateSpec,
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: ['onChange', 'onClear', 'onPressEnter', 'onFocus', 'onBlur'],
  },
})(props => {
  const { defaultValue, updateWhenDefaultValueChanges, ...cProps } =
    getComponentProps(props);
  const { elementRef, mergeState, customStyle, callbackMap } = props;

  const [value, setValue] = useStateValue(
    defaultValue,
    mergeState,
    updateWhenDefaultValueChanges
  );

  const onChange = useCallback(
    (value: string) => {
      setValue(value);
      mergeState({ value });
      callbackMap?.onChange?.();
    },
    [callbackMap, mergeState]
  );

  return (
    <BaseMentions
      ref={elementRef}
      onPressEnter={() => {
        callbackMap?.onPressEnter?.();
      }}
      onClear={() => {
        callbackMap?.onClear?.();
      }}
      className={css(customStyle?.content)}
      onBlur={() => {
        callbackMap?.onBlur?.();
      }}
      onFocus={() => {
        callbackMap?.onFocus?.();
      }}
      onChange={onChange}
      {...cProps}
      value={value}
    />
  );
});
