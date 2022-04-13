import { Alert as BaseAlert } from '@arco-design/web-react';
import { ComponentImpl, implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { AlertPropsSpec as BaseAlertPropsSpec } from '../generated/types/Alert';

const AlertPropsSpec = Type.Object(BaseAlertPropsSpec);
const AlertStateSpec = Type.Object({});

const AlertImpl: ComponentImpl<Static<typeof AlertPropsSpec>> = props => {
  const { elementRef, ...cProps } = getComponentProps(props);
  const { customStyle, slotsElements, callbackMap } = props;

  return (
    <BaseAlert
      ref={elementRef}
      action={slotsElements.action}
      icon={slotsElements.icon}
      onClose={_e => {
        callbackMap?.onClose?.();
      }}
      afterClose={()=>{
        callbackMap?.afterClose?.();
      }}
      className={css(customStyle?.content)}
      {...cProps}
    />
  );
};

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
    slots: ['action', 'icon'],
    styleSlots: ['content'],
    events: ['onClose', 'afterClose'],
  },
};

export const Alert = implementRuntimeComponent(options)(AlertImpl);
