import { Image as BaseImage } from '@chakra-ui/react';
import { css } from '@emotion/css';
import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { BASIC, LAYOUT, BEHAVIOR, APPEARANCE } from './constants/category';

const BoxSizePropertySpec = Type.Union(
  [
    Type.KeyOf(
      Type.Object({
        sm: Type.String(),
        md: Type.String(),
        lg: Type.String(),
        xs: Type.String(),
      })
    ),
    Type.String(),
  ],
  {
    title: 'Box Size',
    category: APPEARANCE,
  }
);

const GlobalCssSpec = Type.KeyOf(
  Type.Object({
    '-moz-initial': Type.String(),
    inherit: Type.String(),
    initial: Type.String(),
    revert: Type.String(),
    unset: Type.String(),
  })
);

const ObjectFitSpec = Type.Union(
  [
    GlobalCssSpec,
    Type.KeyOf(
      Type.Object({
        contain: Type.String(),
        cover: Type.String(),
        fill: Type.String(),
        none: Type.String(),
        'scale-down': Type.String(),
      })
    ),
  ],
  {
    title: 'Object Fit',
    description: 'How the image should be scaled to fit the element.',
    category: BEHAVIOR,
  }
);

const BorderRadiusSpec = Type.Union(
  [
    GlobalCssSpec,
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
  ],
  {
    title: 'Border Radius',
    category: APPEARANCE,
  }
);

const StateSpec = Type.Object({
  value: Type.String(),
});

const PropsSpec = Type.Object({
  // basic
  src: Type.String({
    title: 'Src',
    description: 'The source of the image',
    category: BASIC,
  }),
  fallbackSrc: Type.String({
    title: 'Fallback Src',
    description: 'The source of the image to use when the src fails to load',
    category: BASIC,
  }),
  alt: Type.String({
    title: 'Alt Text',
    description:
      'An accessible description of the image for screen readers. This is also rendered as a fallback if the image fails to load.',
    category: BASIC,
  }),
  ignoreFallback: Type.Boolean({
    title: 'Ignore Fallback',
    description: 'Whether to ignore the fallback image when the src fails to load',
    category: BEHAVIOR,
  }),
  objectFit: ObjectFitSpec,
  crossOrigin: Type.KeyOf(
    Type.Object({
      anonymous: Type.String(),
      'use-credentials': Type.String(),
    }),
    {
      title: 'Cross Origin',
      description: 'How the image should be loaded',
      category: BEHAVIOR,
    }
  ),
  // layout
  htmlHeight: Type.Union([Type.String(), Type.Number()], {
    title: 'Height',
    category: LAYOUT,
  }),
  htmlWidth: Type.Union([Type.String(), Type.Number()], {
    title: 'Width',
    category: LAYOUT,
  }),
  // style
  boxSize: BoxSizePropertySpec,
  borderRadius: BorderRadiusSpec,
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'image',
    displayName: 'Image',
    description: 'chakra_ui image',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {
      src: 'https://bit.ly/dan-abramov',
      fallbackSrc: 'https://via.placeholder.com/150',
      alt: 'dan-abramov',
      ignoreFallback: false,
      objectFit: 'cover',
      crossOrigin: 'anonymous',
      boxSize: 'md',
      htmlHeight: '',
      htmlWidth: '',
      borderRadius: 5,
    },
    exampleSize: [6, 6],
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: PropsSpec,
    state: StateSpec,
    methods: {},
    slots: [],
    styleSlots: ['content'],
    events: ['onLoad', 'onError'],
  },
})(
  ({
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
    customStyle,
    elementRef,
  }) => {
    const style = boxSize
      ? css`
          ${customStyle?.content}
        `
      : css`
          height: 100%;
          width: 100%;
          ${customStyle?.content}
        `;
    return (
      <BaseImage
        className={style}
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
        ref={elementRef}
      />
    );
  }
);
