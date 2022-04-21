import { Button as BaseButton } from '@arco-design/web-react';
import { ComponentImpl, implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { ButtonPropsSpec as BaseButtonPropsSpec } from '../generated/types/Button';

const ButtonPropsSpec = Type.Object({
  ...BaseButtonPropsSpec,
});
const ButtonStateSpec = Type.Object({});

const ButtonImpl: ComponentImpl<Static<typeof ButtonPropsSpec>> = props => {
  const { elementRef, slotsElements, customStyle, text, callbackMap } = props;
  const { ...cProps } = getComponentProps(props);

  return (
    <BaseButton
      ref={elementRef}
      className={css(customStyle?.content)}
      onClick={callbackMap?.onClick}
      icon={slotsElements.icon}
      {...cProps}
      loadingFixedWidth
    >
      {text || null}
    </BaseButton>
  );
};

const exampleProperties: Static<typeof ButtonPropsSpec> = {
  type: 'default',
  status: 'default',
  long: false,
  size: 'default',
  disabled: false,
  loading: false,
  shape: 'square',
  text: 'button',
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'button',
    displayName: 'Button',
    exampleProperties,
    annotations: {
      category: 'Input',
    },
  },
  spec: {
    properties: ButtonPropsSpec,
    state: ButtonStateSpec,
    methods: {},
    slots: ['icon'],
    styleSlots: ['content'],
    events: ['onClick'],
  },
};

export const Button = implementRuntimeComponent(options)(ButtonImpl);
