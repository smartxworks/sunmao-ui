import { Carousel as BaseCarousel } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { CarouselPropsSpec as BaseCarouselPropsSpec } from '../generated/types/Carousel';
import { useRef, useEffect } from 'react';
import { CarouselHandle } from '@arco-design/web-react/es/Carousel/interface';

const InputPropsSpec = Type.Object({
  ...BaseCarouselPropsSpec,
});
const InputStateSpec = Type.Object({
  value: Type.Number(),
});

const defaultCarouselStyle = css`
  height: 240px;
`;

const exampleProperties: Static<typeof InputPropsSpec> = {
  imageSrc: [
    '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
    '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
    '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp',
    '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp',
  ],
  indicatorPosition: 'bottom',
  indicatorType: 'dot',
  showArrow: 'always',
  direction: 'horizontal',
  animation: 'slide',
  autoPlay: false,
  autoPlayInterval: 3000,
  autoPlayHoverToPause: true,
  moveSpeed: 500,
  timingFunc: 'cubic-bezier(0.34, 0.69, 0.1, 1)',
};

export const Carousel = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'carousel',
    displayName: 'Carousel',
    exampleProperties,
    annotations: {
      category: 'Data Display',
    },
  },
  spec: {
    properties: InputPropsSpec,
    state: InputStateSpec,
    methods: {},
    slots: {},
    styleSlots: ['carousel', 'image'],
    events: ['onChange', 'onBlur', 'onFocus'],
  },
})(props => {
  const { getElement, customStyle } = props;
  const { imageSrc, autoPlay, autoPlayHoverToPause, autoPlayInterval, ...cProps } =
    getComponentProps(props);
  const ref = useRef<CarouselHandle>(null as any);

  useEffect(() => {
    const ele = ref.current?.dom;
    if (getElement && ele) {
      getElement(ele);
    }
  }, [getElement, ref]);

  return (
    <BaseCarousel
      carousel={ref}
      autoPlay={
        autoPlay && { interval: autoPlayInterval, hoverToPause: autoPlayHoverToPause }
      }
      className={css(customStyle?.carousel, defaultCarouselStyle)}
      {...cProps}
    >
      {imageSrc.map((src, idx) => {
        return (
          <div className={css(customStyle?.image)} key={idx}>
            <img style={{ width: '100%' }} src={src} />
          </div>
        );
      })}
    </BaseCarousel>
  );
});
