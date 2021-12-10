import { Menu as BaseMenu } from "@arco-design/web-react";
import { ComponentImplementation } from "@sunmao-ui/runtime";
import { createComponent } from "@sunmao-ui/core";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { MenuPropsSchema as BaseMenuPropsSchema } from "../generated/types/Menu";
import { useEffect, useState } from "react";

const MenuPropsSchema = Type.Object({
  ...BaseMenuPropsSchema,
  items: Type.Optional(
    Type.Array(
      Type.Object({
        key: Type.String(),
        text: Type.String(),
        disabled: Type.Optional(Type.Boolean()),
      })
    )
  ),
});
const MenuStateSchema = Type.Object({
  activeKey: Type.Optional(Type.String()),
});

const MenuImpl: ComponentImplementation<Static<typeof MenuPropsSchema>> = (
  props
) => {
  const { customStyle, callbackMap, mergeState } = props;
  const { items = [], ...cProps } = getComponentProps(props);
  const [activeKey, setActiveKey] = useState<string>();
  useEffect(() => {
    mergeState({
      activeKey,
    });
  }, [activeKey]);

  return (
    <BaseMenu
      className={css(customStyle?.content)}
      onClickMenuItem={(key) => {
        setActiveKey(key);
        callbackMap?.onClick();
      }}
      {...cProps}
    >
      {items.map((item) => (
        <BaseMenu.Item key={item.key} disabled={item.disabled}>
          {item.text}
        </BaseMenu.Item>
      ))}
    </BaseMenu>
  );
};

export const Menu = {
  ...createComponent({
    version: "arco/v1",
    metadata: {
      ...FALLBACK_METADATA,
      name: "menu",
    },
    spec: {
      properties: MenuPropsSchema,
      state: MenuStateSchema,
      methods: [],
      slots: [],
      styleSlots: ["content"],
      events: ["onClick"],
    },
  }),
  impl: MenuImpl,
};
