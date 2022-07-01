import { Image as BaseImage, Space } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import {
  ImageGroupPropsSpec,
  ImagePropsSpec as BaseImagePropsSpec,
} from '../generated/types/Image';

const ImagePropsSpec = Type.Object(BaseImagePropsSpec);
const ImageStateSpec = Type.Object({});

const exampleProperties: Static<typeof ImagePropsSpec> = {
  src: 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
  title: 'A user’s avatar',
  description: 'Present by Arco Design',
  footerPosition: 'inner',
  simple: false,
  preview: false,
  width: 200,
  height: 200,
  error: '',
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'image',
    displayName: 'Image',
    exampleProperties,
    annotations: {
      category: 'Data Display',
    },
  },
  spec: {
    properties: ImagePropsSpec,
    state: ImageStateSpec,
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: ['onClick'],
  },
};
export const Image = implementRuntimeComponent(options)(props => {
  const { elementRef, customStyle, callbackMap } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseImage
      ref={elementRef}
      className={css(customStyle?.content)}
      onClick={callbackMap?.onClick}
      {...cProps}
    />
  );
});

export const ImageGroup = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'imageGroup',
    displayName: 'Image Group',
    exampleProperties: {
      imageItems: [
        {
          src: '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
          width: 200,
          height: 200,
        },
        {
          src: '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/e278888093bef8910e829486fb45dd69.png~tplv-uwbnlip3yd-webp.webp',
          width: 200,
          height: 200,
        },
        {
          src: '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp',
          width: 200,
          height: 200,
        },
        {
          src: '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/8361eeb82904210b4f55fab888fe8416.png~tplv-uwbnlip3yd-webp.webp',
          width: 200,
          height: 200,
        },
      ],
      src: '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/8361eeb82904210b4f55fab888fe8416.png~tplv-uwbnlip3yd-webp.webp',
      infinite: true,
      maskClosable: true,
      closable: false,
    },
    annotations: {
      category: 'Data Display',
    },
  },
  spec: {
    properties: Type.Object(ImageGroupPropsSpec),
    state: Type.Object({
      current: Type.Number(),
    }),
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: ['onChange'],
  },
})(props => {
  const { elementRef, customStyle, mergeState, callbackMap } = props;
  const { imageItems, ...cProps } = getComponentProps(props);

  return (
    <div ref={elementRef}>
      <BaseImage.PreviewGroup
        {...cProps}
        className={css`
          ${customStyle?.content}
        `}
        onChange={idx => {
          mergeState({
            current: idx,
          });
          callbackMap?.onChange?.();
        }}
      >
        {imageItems.map((item, idx) => (
          <Space key={idx}>
            <BaseImage {...item} />
          </Space>
        ))}
      </BaseImage.PreviewGroup>
    </div>
  );
});
