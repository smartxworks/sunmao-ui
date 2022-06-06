import { Switch as BaseSwitch } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { SwitchPropsSpec as BaseSwitchPropsSpec } from '../generated/types/Switch';
import { useStateValue } from '../hooks/useStateValue';

const SwitchPropsSpec = Type.Object({
  ...BaseSwitchPropsSpec,
});
const SwitchStateSpec = Type.Object({
  value: Type.Boolean(),
});

const exampleProperties: Static<typeof SwitchPropsSpec> = {
  defaultChecked: false,
  disabled: false,
  loading: false,
  type: 'circle',
  size: 'default',
  updateWhenDefaultValueChanges: false,
};

export const Switch = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'switch',
    displayName: 'Switch',
    exampleProperties,
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: SwitchPropsSpec,
    state: SwitchStateSpec,
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: ['onChange'],
  },
})(props => {
  const { elementRef, customStyle, mergeState, callbackMap } = props;
  const { defaultChecked, updateWhenDefaultValueChanges, ...cProps } =
    getComponentProps(props);
  const [value, setValue] = useStateValue(
    defaultChecked,
    mergeState,
    updateWhenDefaultValueChanges
  );

  return (
    <BaseSwitch
      ref={elementRef}
      className={css(customStyle?.content)}
      checked={value}
      {...cProps}
      onChange={value => {
        setValue(value);
        mergeState({ value });
        callbackMap?.onChange?.();
      }}
    />
  );
});
