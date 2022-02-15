import { Image as BaseImage } from "@arco-design/web-react";
import {
  ComponentImpl,
  implementRuntimeComponent,
} from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { ImagePropsSchema as BaseImagePropsSchema } from "../generated/types/Image";

const ImagePropsSchema = Type.Object(BaseImagePropsSchema);
const ImageStateSchema = Type.Object({});


const ImageImpl: ComponentImpl<Static<typeof ImagePropsSchema>> = (
  props
) => {
  const { customStyle, callbackMap } = props;
  const cProps = getComponentProps(props);

  return (
    <BaseImage
      className={css(customStyle?.content)}
      onClick={callbackMap?.onClick}
      {...cProps}
    />
  );
};
const exampleProperties: Static<typeof ImagePropsSchema> = {
  src :'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
  title:"stars",
  description:"sunmao-ui's stars",
  footerPosition:'inner',
  simple:true,
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
    properties: ImagePropsSchema,
    state: ImageStateSchema,
    methods: {},
    slots: [],
    styleSlots: ["content"],
    events: [],
  },
};
export const Image = implementRuntimeComponent(options)(ImageImpl);
