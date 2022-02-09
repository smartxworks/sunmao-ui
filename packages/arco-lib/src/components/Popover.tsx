import { Popover as BasePopover, Button } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { PopoverPropsSchema as BasePopoverPropsSchema } from "../generated/types/Popover";
import { useEffect, useState } from "react";
import { isArray } from "lodash-es";

const PopoverPropsSchema = Type.Object(BasePopoverPropsSchema);
const PopoverStateSchema = Type.Object({});

const PopoverImpl: ComponentImpl<Static<typeof PopoverPropsSchema>> = (
  props
) => {
  const { controlled, ...cProps } = getComponentProps(props);
  const { subscribeMethods, slotsElements, customStyle } = props;

  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    subscribeMethods({
      openPopover() {
        setPopupVisible(true);
      },
      closePopover() {
        setPopupVisible(false);
      },
    });
  }, [subscribeMethods]);

  // TODO only support arco componets slot now (same as Tooltip)
  const content = isArray(slotsElements.content)
    ? slotsElements.content[0]
    : slotsElements.content

  return controlled ? (
    <BasePopover
      className={css(customStyle?.content)}
      {...cProps}
      content={slotsElements.popupContent}
    >
      {content||<Button>Click</Button>}
    </BasePopover>
  ) : (
    <BasePopover
      className={css(customStyle?.content)}
      {...cProps}
      content={slotsElements.popupContent}
      popupVisible={popupVisible}
      onVisibleChange={(visible) => {
        setPopupVisible(visible)
      }}
    >
      {content||<Button>Click</Button>}
    </BasePopover>
  );
};
const exampleProperties: Static<typeof PopoverPropsSchema> = {
  color: "#eee",
  position: "bottom",
  mini: false,
  unmountOnExit: true,
  disabled: false,
  controlled: false,
  // TODO There are some problems with hover mode that need to be verified later
  trigger: "click",
  title: "Title",
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "popover",
    displayName: "Popover",
    exampleProperties,
  },
  spec: {
    properties: PopoverPropsSchema,
    state: PopoverStateSchema,
    methods: {
      setPopupVisible: Type.String(),
    } as Record<string, any>,
    slots: ["popupContent", "content"],
    styleSlots: ["content"],
    events: [],
  },
};

export const Popover = implementRuntimeComponent(options)(PopoverImpl);
