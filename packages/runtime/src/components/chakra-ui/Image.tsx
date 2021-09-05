import React from 'react';
import { Image as BaseImage } from '@chakra-ui/react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { ComponentImplementation } from '../../registry';

const SrcPropertySchema = Type.String();
const OptionalStringPropertySchema = Type.Optional(Type.String());
const IgnoreFallbackPropertySchema = Type.Optional(Type.Boolean());
const HeightSchema = Type.Optional(Type.Union([Type.String(), Type.Number()]));

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

const CrossOriginSchema = Type.Optional(
  Type.KeyOf(
    Type.Object({
      anonymous: Type.String(),
      'use-credentials': Type.String(),
    })
  )
);

const Image: ComponentImplementation<{
  boxSize?: Static<typeof BoxSizePropertySchema>;
  src: Static<typeof SrcPropertySchema>;
  fallbackSrc?: Static<typeof OptionalStringPropertySchema>;
  alt?: Static<typeof OptionalStringPropertySchema>;
  ignoreFallback?: Static<typeof IgnoreFallbackPropertySchema>;
  objectFit?: Static<typeof ObjectFitSchema>;
  borderRadius?: Static<typeof BorderRadiusSchema>;
  htmlHeight?: Static<typeof HeightSchema>;
  htmlWidth?: Static<typeof HeightSchema>;
  crossOrigin?: Static<typeof CrossOriginSchema>;
}> = ({
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
}) => {
  return (
    <BaseImage
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
      fallbackSrc={fallbackSrc}></BaseImage>
  );
};

const StateSchema = Type.Object({
  value: Type.String(),
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'image',
      description: 'chakra_ui image',
    },
    spec: {
      properties: [
        {
          name: 'src',
          ...SrcPropertySchema,
        },
        {
          name: 'fallbackSrc',
          ...OptionalStringPropertySchema,
        },
        {
          name: 'boxSize',
          ...BoxSizePropertySchema,
        },
        {
          name: 'objectFit',
          ...ObjectFitSchema,
        },
        {
          name: 'borderRadius',
          ...BorderRadiusSchema,
        },
        {
          name: 'ignoreFallback',
          ...IgnoreFallbackPropertySchema,
        },
        {
          name: 'alt',
          ...OptionalStringPropertySchema,
        },
        {
          name: 'htmlHeight',
          ...HeightSchema,
        },
        {
          name: 'htmlWidth',
          ...HeightSchema,
        },
        {
          name: 'crossOrigin',
          ...CrossOriginSchema,
        },
      ],
      acceptTraits: [],
      state: StateSchema,
      methods: [{ name: 'onLoad' }],
    },
  }),
  impl: Image,
};
