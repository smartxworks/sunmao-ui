import { Image as BaseImage } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { ImagePropsSpec as BaseImagePropsSpec } from "../generated/types/Image";

const ImagePropsSpec = Type.Object(BaseImagePropsSpec);
const ImageStateSpec = Type.Object({});

const ImageImpl: ComponentImpl<Static<typeof ImagePropsSpec>> = (props) => {
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
};
const exampleProperties: Static<typeof ImagePropsSpec> = {
  src :'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
  title:"A user’s avatar",
  description:"Present by Arco Design",
  footerPosition:'inner',
  simple:false,
  preview:false,
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "image",
    displayName: "Image",
    exampleProperties,
    annotations: {
      category: "Display",
    }
  },
  spec: {
    properties: ImagePropsSpec,
    state: ImageStateSpec,
    methods: {},
    slots: [],
    styleSlots: ["content"],
    events: [],
  },
};
export const Image = implementRuntimeComponent(options)(ImageImpl);
