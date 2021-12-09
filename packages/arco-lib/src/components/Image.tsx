import { Image as BaseImage } from "@arco-design/web-react";
import { ComponentImplementation } from "@sunmao-ui/runtime";
import { createComponent } from "@sunmao-ui/core";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { ImagePropsSchema as BaseImagePropsSchema } from "../generated/types/Image";

const ImagePropsSchema = Type.Object(BaseImagePropsSchema);
const ImageStateSchema = Type.Object({});

const ImageImpl: ComponentImplementation<Static<typeof ImagePropsSchema>> = (
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

export const Image = {
  ...createComponent({
    version: "arco/v1",
    metadata: {
      ...FALLBACK_METADATA,
      name: "image",
    },
    spec: {
      properties: ImagePropsSchema,
      state: ImageStateSchema,
      methods: [],
      slots: [],
      styleSlots: ["content"],
      events: [],
    },
  }),
  impl: ImageImpl,
};
