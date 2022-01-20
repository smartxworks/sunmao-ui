import { Popover as BasePopover } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { PopoverPropsSchema as BasePopoverPropsSchema } from "../generated/types/Popover";
import { useEffect, useState } from "react";

const PopoverPropsSchema = Type.Object(BasePopoverPropsSchema);
const PopoverStateSchema = Type.Object({
  visible: Type.String(),
});

const PopoverImpl: ComponentImpl<Static<typeof PopoverPropsSchema>> = (
  props
) => {
  const { controlled, ...cProps } = getComponentProps(props);
  const {
    mergeState,
    subscribeMethods,
    slotsElements,
    customStyle,
    className,
  } = props;

  const [popupVisible, _setPopupVisible] = useState(false);

  useEffect(() => {
    subscribeMethods({
      setPopupVisible({ visible }) {
        _setPopupVisible(!!visible);
      },
    });
  }, [subscribeMethods]);
  useEffect(() => {
    mergeState({ visible: popupVisible });
  }, [popupVisible, mergeState]);

  // TODO only support arco componets slot now (same as Tooltip)
  const content = slotsElements.content && slotsElements.content[0];

  return controlled ? (
    <BasePopover
      className={cx(className, css(customStyle?.content))}
      {...cProps}
      content={slotsElements.popupContent}
      popupVisible={popupVisible}
      onVisibleChange={(visible) => {
        if (visible) {
          _setPopupVisible(true);
        }
      }}
    >
      {content}
    </BasePopover>
  ) : (
    <BasePopover
      className={cx(className, css(customStyle?.content))}
      {...cProps}
      content={slotsElements.popupContent}
    >
      {content}
    </BasePopover>
  );
};
const exampleProperties: Static<typeof PopoverPropsSchema> = {
  className: "",
  color: "#eee",
  position: "bottom",
  mini: false,
  unmountOnExit: true,
  defaultPopupVisible: false,
  popupHoverStay: true,
  blurToHide: true,
  disabled: false,
  content: "This is Popover",
  controlled: false,
  trigger: "hover",
  title: "Title",
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "Popover",
    displayName: "Popover",
    exampleProperties,
  },
  spec: {
    properties: PopoverPropsSchema,
    state: PopoverStateSchema,
    methods: {
      setPopupVisible: Type.String(),
    },
    slots: ["popupContent", "content"],
    styleSlots: ["content"],
    events: [],
  },
};

export const Popover = implementRuntimeComponent(options)(PopoverImpl);
