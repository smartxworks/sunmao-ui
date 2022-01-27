import { Collapse as BaseCollapse } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import {
  CollapsePropsSchema as BaseCollapsePropsSchema,
  CollapseItemPropsSchema as BaseCollapseItemPropsSchema,
} from "../generated/types/Collapse";
import { isArray } from "lodash";
import { useEffect, useState } from "react";

const CollapsePropsSchema = Type.Object(BaseCollapsePropsSchema);
const CollapseStateSchema = Type.Object({
  activeKey: Type.Union([Type.String(), Type.Array(Type.String())]),
});

const CollapseImpl: ComponentImpl<Static<typeof CollapsePropsSchema>> = (
  props
) => {
  const { ...cProps } = getComponentProps(props);
  const {
    mergeState,
    subscribeMethods,
    slotsElements,
    customStyle,
    className,
  } = props;
  let defaultActiveKey: string | string[] = "";

  // sunmao runtime will covert string type number '1' to 1 for historical reasons
  // so we need convert back
  if (cProps.defaultActiveKey) {
    defaultActiveKey = isArray(cProps.defaultActiveKey)
      ? cProps.defaultActiveKey.map(String)
      : String(cProps.defaultActiveKey);
  }

  const [activeKey, _setActiveKey] = useState<string | string[]>(
    defaultActiveKey
  );

  useEffect(() => {
    subscribeMethods({
      setActiveKey({ activeKey }) {
        _setActiveKey(String(activeKey));
      },
    });
  }, []);

  // TODO sunmao editor view not rerender when activeKey changed
  useEffect(() => {
    mergeState({ activeKey });
  }, [activeKey]);

  const onChange = (currentOperateKey: string, activeKey: string[]) => {
    _setActiveKey(activeKey);
  };

  return (
    <BaseCollapse
      className={cx(className, css(customStyle?.content))}
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
  className: "",
  defaultActiveKey: "1",
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
  const { slotsElements, customStyle, className } = props;

  return (
    <BaseCollapse.Item
      name={String(name)}
      className={cx(className, css(customStyle?.content))}
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
      className: "",
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
    events: [],
  },
})(CollapseItemImpl);
