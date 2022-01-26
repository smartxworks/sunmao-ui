import { Tooltip as BaseTooltip } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { TooltipPropsSchema as BaseTooltipPropsSchema } from "../generated/types/Tooltip";
import { useEffect, useState } from "react";
import { isArray } from "lodash-es";

const TooltipPropsSchema = Type.Object(BaseTooltipPropsSchema);
const TooltipStateSchema = Type.Object({
  visible: Type.String(),
});

const TooltipImpl: ComponentImpl<Static<typeof TooltipPropsSchema>> = (
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
  }, [mergeState, popupVisible]);

  // two components in the array will be wrapped by span respectively
  // and arco does not support `array.length===1` think it is a bug
  // TODO only support arco componets slot now
  const content = isArray(slotsElements.content) ? slotsElements.content[0] : slotsElements.content;

  return controlled ? (
    <BaseTooltip
      className={cx(className, css(customStyle?.content))}
      {...cProps}
      popupVisible={popupVisible}
    >
      {content}
    </BaseTooltip>
  ) : (
    <BaseTooltip
      className={cx(className, css(customStyle?.content))}
      {...cProps}
    >
      {content}
    </BaseTooltip>
  );
};
const exampleProperties: Static<typeof TooltipPropsSchema> = {
  className: "",
  color: "red",
  position: "bottom",
  mini: false,
  unmountOnExit: true,
  defaultPopupVisible: false,
  popupHoverStay: true,
  blurToHide: true,
  disabled: false,
  content: "This is tooltip",
  controlled: false,
  trigger: ["hover", "click"],
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "Tooltip",
    displayName: "Tooltip",
    exampleProperties,
  },
  spec: {
    properties: TooltipPropsSchema,
    state: TooltipStateSchema,
    methods: {
      setPopupVisible: Type.String(),
    } as Record<string, any>,
    slots: ["content"],
    styleSlots: ["content"],
    events: [],
  },
};

export const Tooltip = implementRuntimeComponent(options)(TooltipImpl);
