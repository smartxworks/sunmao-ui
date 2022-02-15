import { Tooltip as BaseTooltip, Button } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { TooltipPropsSchema as BaseTooltipPropsSchema } from "../generated/types/Tooltip";
import { isArray } from "lodash-es";
import { useState, useEffect } from "react";

const TooltipPropsSchema = Type.Object(BaseTooltipPropsSchema);
const TooltipStateSchema = Type.Object({});

const TooltipImpl: ComponentImpl<Static<typeof TooltipPropsSchema>> = (
  props
) => {
  const { controlled, ...cProps } = getComponentProps(props);
  const { elementRef, subscribeMethods, slotsElements, customStyle } = props;

  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    subscribeMethods({
      openTooltip() {
        setPopupVisible(true);
      },
      closeTooltip() {
        setPopupVisible(false);
      },
    });
  }, [subscribeMethods]);

  // two components in the array will be wrapped by span respectively
  // and arco does not support `array.length===1` think it is a bug
  // TODO only support arco componets slot now
  const content = isArray(slotsElements.content)
    ? slotsElements.content[0]
    : slotsElements.content;

  return controlled ? (
    <BaseTooltip
      ref={elementRef}
      className={css(customStyle?.content)}
      {...cProps}
      popupVisible={popupVisible}
    >
      {content || <Button>Click</Button>}
    </BaseTooltip>
  ) : (
    <BaseTooltip elementRef className={css(customStyle?.content)} {...cProps}>
      {content || <Button>Click</Button>}
    </BaseTooltip>
  );
};
const exampleProperties: Static<typeof TooltipPropsSchema> = {
  color: "#bbb",
  position: "bottom",
  mini: false,
  unmountOnExit: true,
  disabled: false,
  content: "This is tooltip",
  // TODO There are some problems with hover mode that need to be verified later
  trigger: "click",
  controlled: false,
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "tooltip",
    displayName: "Tooltip",
    exampleProperties,
  },
  spec: {
    properties: TooltipPropsSchema,
    state: TooltipStateSchema,
    methods: {
      openTooltip: Type.String(),
      closeTooltip: Type.String(),
    } as Record<string, any>,
    slots: ["content"],
    styleSlots: ["content"],
    events: [],
  },
};

export const Tooltip = implementRuntimeComponent(options)(TooltipImpl);
