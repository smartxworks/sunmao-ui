import { Collapse as BaseCollapse } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import {
  CollapsePropsSchema as BaseCollapsePropsSchema,
  CollapseItemPropsSchema as BaseCollapseItemPropsSchema,
} from "../generated/types/Collapse";
import { useEffect, useState } from "react";

const CollapsePropsSchema = Type.Object(BaseCollapsePropsSchema);
const CollapseStateSchema = Type.Object({
  activeKey: Type.Array(Type.String())
});

const CollapseImpl: ComponentImpl<Static<typeof CollapsePropsSchema>> = (
  props
) => {
  const { defaultActiveKey,...cProps } = getComponentProps(props);
  const {
    mergeState,
    slotsElements,
    customStyle,
    callbackMap,
  } = props;

  const [activeKey, setActiveKey] = useState<string[]>(defaultActiveKey.map(String));

  useEffect(() => {
    mergeState({ activeKey });
  }, [activeKey, mergeState]);

  const onChange = (currentOperateKey: string, activeKey: string[]) => {
    setActiveKey(activeKey);
    callbackMap?.onChange?.();
  };

  return (
    <BaseCollapse
      className={css(customStyle?.content)}
      {...cProps}
      defaultActiveKey={defaultActiveKey}
      activeKey={activeKey}
      onChange={onChange}
    >
      {slotsElements.collapseItems && slotsElements.collapseItems}
    </BaseCollapse>
  );
};
const exampleProperties: Static<typeof CollapsePropsSchema> = {
  defaultActiveKey: ["1"],
  accordion: false,
  expandIconPosition: "left",
  bordered: false,
  lazyload: true,
  destroyOnHide: true,
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "collapse",
    displayName: "Collapse",
    exampleProperties,
  },
  spec: {
    properties: CollapsePropsSchema,
    state: CollapseStateSchema,
    methods: {
      setActiveKey: Type.String(),
    },
    slots: ["collapseItems"],
    styleSlots: ["content"],
    events: [],
  },
};

export const Collapse = implementRuntimeComponent(options)(
  CollapseImpl as typeof CollapseImpl & undefined
);

const CollapseItemPropsSchema = Type.Object(BaseCollapseItemPropsSchema);
const CollapseItemStateSchema = Type.Object({});

const CollapseItemImpl: ComponentImpl<
  Static<typeof CollapseItemPropsSchema>
> = (props) => {
  const { name, ...cProps } = getComponentProps(props);
  const { slotsElements, customStyle } = props;

  return (
    <BaseCollapse.Item
      name={String(name)}
      className={css(customStyle?.content)}
      {...cProps}
    >
      {slotsElements.content}
    </BaseCollapse.Item>
  );
};

export const CollapseItem = implementRuntimeComponent({
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "CollapseItem",
    displayName: "CollapseItem",
    exampleProperties: {
      name: "1",
      disabled: false,
      showExpandIcon: true,
      destroyOnHide: true,
      header: "header",
    },
  },
  spec: {
    properties: CollapseItemPropsSchema,
    state: CollapseItemStateSchema,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: ["onChange"],
  },
})(CollapseItemImpl);
