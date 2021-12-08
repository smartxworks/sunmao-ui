// move to @sunmao-ui/runtime in the future?

import { ComponentMetadata } from "@sunmao-ui/core/lib/metadata";
import { ComponentImplementationProps } from "@sunmao-ui/runtime";

export const FALLBACK_METADATA: ComponentMetadata = {
  name: "",
  description: "",
  displayName: "",
  isDraggable: true,
  isResizable: true,
  exampleProperties: {},
  exampleSize: [1, 1],
};

export const getComponentProps = <T>(
  props: T & ComponentImplementationProps
): T => {
  const {
    component,
    slotsMap,
    targetSlot,
    services,
    app,
    gridCallbacks,
    componentWrapper,
    data,
    customStyle,
    callbackMap,
    effects,
    mergeState,
    subscribeMethods,
    ...rest
  } = props;
  return (rest as unknown) as T;
};
