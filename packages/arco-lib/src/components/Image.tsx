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
  src :'https://camo.githubusercontent.com/e90098399ac24211c2fbb2c97111caaaeea182ba4df4a889798c3af3f9c3478f/68747470733a2f2f62616467656e2e6e65742f6769746875622f73746172732f7765627a6172642d696f2f73756e6d616f2d7569',
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
    exampleProperties
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
