import { Avatar as BaseAvatar } from '@arco-design/web-react';
import { ComponentImpl, implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { AvatarPropsSchema as BaseAvatarPropsSchema } from '../generated/types/Avatar';

const AvatarPropsSchema = Type.Object({
  ...BaseAvatarPropsSchema,
});
const AvatarStateSchema = Type.Object({});

const AvatarImpl: ComponentImpl<Static<typeof AvatarPropsSchema>> = props => {
  const { slotsElements, elementRef, customStyle } = props;
  const { type, src, text, ...cProps } = getComponentProps(props);

  return (
    <BaseAvatar
      ref={elementRef}
      className={css(customStyle?.content)}
      {...cProps}
      triggerIcon={slotsElements.triggerIcon}
    >
      {type === 'img' ? <img src={src} /> : text}
    </BaseAvatar>
  );
};

const exampleProperties: Static<typeof AvatarPropsSchema> = {
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
    properties: AvatarPropsSchema,
    state: AvatarStateSchema,
    methods: {},
    slots: ['triggerIcon'],
    styleSlots: ['content'],
    events: [],
  },
};

export const Avatar = implementRuntimeComponent(options)(AvatarImpl);
