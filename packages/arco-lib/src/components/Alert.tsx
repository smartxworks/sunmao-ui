import { Alert as BaseAlert } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { AlertPropsSpec as BaseAlertPropsSpec } from '../generated/types/Alert';

const AlertPropsSpec = Type.Object(BaseAlertPropsSpec);
const AlertStateSpec = Type.Object({});

const exampleProperties: Static<typeof AlertPropsSpec> = {
  closable: true,
  title: 'info',
  content: 'Here is an example text',
  showIcon: true,
  banner: false,
  type: 'info',
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'alert',
    displayName: 'Alert',
    exampleProperties,
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: AlertPropsSpec,
    state: AlertStateSpec,
    methods: {},
    slots: {
      action: { slotProps: Type.Object({}) },
      icon: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content'],
    events: ['onClose', 'afterClose'],
  },
};

export const Alert = implementRuntimeComponent(options)(props => {
  const { ...cProps } = getComponentProps(props);
  const { elementRef, customStyle, slotsElements, callbackMap } = props;

  return (
    <BaseAlert
      ref={elementRef}
      action={slotsElements.action ? <slotsElements.action /> : null}
      icon={slotsElements.icon ? <slotsElements.icon /> : null}
      onClose={_e => {
        callbackMap?.onClose?.();
      }}
      afterClose={() => {
        callbackMap?.afterClose?.();
      }}
      className={css(customStyle?.content)}
      {...cProps}
    />
  );
});
