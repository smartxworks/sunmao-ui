import { Image as BaseImage } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { createComponent } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { ComponentImplementation } from '../../services/registry';

const BoxSizePropertySchema = Type.Optional(
  Type.Union([
    Type.KeyOf(
      Type.Object({
        sm: Type.String(),
        md: Type.String(),
        lg: Type.String(),
        xs: Type.String(),
      })
    ),
    Type.String(),
  ])
);

const GlobalCssSchema = Type.KeyOf(
  Type.Object({
    '-moz-initial': Type.String(),
    inherit: Type.String(),
    initial: Type.String(),
    revert: Type.String(),
    unset: Type.String(),
  })
);

const ObjectFitSchema = Type.Optional(
  Type.Union([
    GlobalCssSchema,
    Type.KeyOf(
      Type.Object({
        contain: Type.String(),
        cover: Type.String(),
        fill: Type.String(),
        none: Type.String(),
        'scale-down': Type.String(),
      })
    ),
  ])
);

const BorderRadiusSchema = Type.Optional(
  Type.Union([
    GlobalCssSchema,
    Type.Number(),
    Type.String(),
    Type.KeyOf(
      Type.Object({
        radii: Type.String(),
        sm: Type.String(),
        md: Type.String(),
        lg: Type.String(),
        base: Type.String(),
        xl: Type.String(),
        '2xl': Type.String(),
        full: Type.String(),
        '3xl': Type.String(),
      })
    ),
  ])
);

const Image: ComponentImplementation<Static<typeof PropsSchema>> = ({
  boxSize,
  src,
  alt,
  objectFit,
  borderRadius,
  fallbackSrc,
  ignoreFallback,
  htmlWidth,
  htmlHeight,
  crossOrigin,
  callbackMap,
  customStyle
}) => {
  const style = boxSize
    ? css`${customStyle?.content}`
    : css`
        height: 100%;
        width: 100%;
        ${customStyle?.content}
      `;
  return (
    <BaseImage
      css={style}
      src={src}
      alt={alt}
      objectFit={objectFit}
      boxSize={boxSize}
      onLoad={callbackMap?.onLoad}
      htmlHeight={htmlHeight}
      htmlWidth={htmlWidth}
      crossOrigin={crossOrigin}
      onError={callbackMap?.onError}
      ignoreFallback={ignoreFallback}
      borderRadius={borderRadius}
      fallbackSrc={fallbackSrc}
    ></BaseImage>
  );
};

const StateSchema = Type.Object({
  value: Type.String(),
});

const PropsSchema = Type.Object({
  src: Type.String(),
  fallbackSrc: Type.Optional(Type.String()),
  boxSize: BoxSizePropertySchema,
  objectFit: ObjectFitSchema,
  borderRadius: BorderRadiusSchema,
  ignoreFallback: Type.Optional(Type.Boolean()),
  alt: Type.Optional(Type.String()),
  htmlHeight: Type.Optional(Type.Union([Type.String(), Type.Number()])),
  htmlWidth: Type.Optional(Type.Union([Type.String(), Type.Number()])),
  crossOrigin: Type.Optional(
    Type.KeyOf(
      Type.Object({
        anonymous: Type.String(),
        'use-credentials': Type.String(),
      })
    )
  ),
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'image',
      displayName: 'Image',
      description: 'chakra_ui image',
      isDraggable: true,
      isResizable: true,
      exampleProperties: {
        src: 'https://bit.ly/dan-abramov',
        alt: 'dan-abramov',
        objectFit: 'cover',
        borderRadius: 5,
        fallbackSrc: 'https://via.placeholder.com/150',
      },
      exampleSize: [6, 6],
    },
    spec: {
      properties: PropsSchema,
      state: StateSchema,
      methods: [],
      slots: [],
      styleSlots: ['content'],
      events: ['onLoad', 'onError'],
    },
  }),
  impl: Image,
};
