import { Avatar as BaseAvatar } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { AvatarPropsSpec as BaseAvatarPropsSpec } from '../generated/types/Avatar';

const AvatarPropsSpec = Type.Object({
  ...BaseAvatarPropsSpec,
});
const AvatarStateSpec = Type.Object({});

const exampleProperties: Static<typeof AvatarPropsSpec> = {
  shape: 'circle',
  triggerType: 'button',
  size: 50,
  type: 'text',
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'avatar',
    displayName: 'Avatar',
    exampleProperties,
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: AvatarPropsSpec,
    state: AvatarStateSpec,
    methods: {},
    slots: ['triggerIcon'],
    styleSlots: ['content'],
    events: ['onClick'],
  },
};

export const Avatar = implementRuntimeComponent(options)(props => {
  const { slotsElements, elementRef, callbackMap, customStyle } = props;
  const { type, src, text, ...cProps } = getComponentProps(props);

  return (
    <BaseAvatar
      ref={elementRef}
      className={css(customStyle?.content)}
      {...cProps}
      triggerIcon={slotsElements.triggerIcon}
      onClick={_e => {
        callbackMap?.onClick?.();
      }}
    >
      {type === 'img' ? <img src={src} /> : text}
    </BaseAvatar>
  );
});
