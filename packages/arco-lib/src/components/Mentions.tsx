import { Mentions as BaseMentions } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { MentionsPropsSpec as BaseMentionsPropsSpec } from '../generated/types/Mentions';
import { useState, useEffect } from 'react';

const MentionsPropsSpec = Type.Object(BaseMentionsPropsSpec);
const MentionsStateSpec = Type.Object({
  value: Type.String(),
});

const exampleProperties: Static<typeof MentionsPropsSpec> = {
  defaultValue: 'smartx',
  options: ['smartx', 'byte and dance', 'baidu'],
  prefix: '@',
  position: 'bl',
  split: ' ',
  error: false,
  allowClear: true,
  disabled: false,
  placeholder: 'you can mentions sb by prefix "@"',
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'mentions',
    displayName: 'Mentions',
    exampleProperties,
  },
  spec: {
    properties: MentionsPropsSpec,
    state: MentionsStateSpec,
    methods: {},
    slots: [],
    styleSlots: ['content'],
    events: ['onChange', 'onClear', 'onPressEnter', 'onFocus', 'onBlur'],
  },
};

export const Mentions = implementRuntimeComponent(options)(props => {
  const { elementRef, defaultValue, ...cProps } = getComponentProps(props);
  const { mergeState, customStyle, callbackMap } = props;

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    mergeState({ value });
  }, [mergeState, value]);

  const onChange = (value: string) => {
    setValue(value);
    callbackMap?.onChange?.();
  };

  const onClear = () => {
    callbackMap?.onClear?.();
  };

  const onPressEnter = () => {
    callbackMap?.onPressEnter?.();
  };

  return (
    <BaseMentions
      ref={elementRef}
      onPressEnter={onPressEnter}
      onClear={onClear}
      className={css(customStyle?.content)}
      onBlur={() => callbackMap?.onBlur?.()}
      onFocus={() => callbackMap?.onFocus?.()}
      onChange={onChange}
      {...cProps}
      value={value}
    />
  );
});
