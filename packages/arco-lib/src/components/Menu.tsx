import { Menu as BaseMenu } from '@arco-design/web-react';
import { ComponentImpl, implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { MenuPropsSchema as BaseMenuPropsSchema } from '../generated/types/Menu';
import { useEffect, useState } from 'react';
import { Category } from '../constants/category';

const MenuPropsSchema = Type.Object({
  ...BaseMenuPropsSchema,
  defaultActiveKey: Type.String({
    title: 'Default Active Key',
    category: Category.Basic,
  }),
  items: Type.Array(
    Type.Object({
      key: Type.String(),
      text: Type.String(),
      disabled: Type.Optional(Type.Boolean()),
    }),
    {
      category: Category.Basic,
    }
  ),
});
const MenuStateSchema = Type.Object({
  activeKey: Type.Optional(Type.String()),
});

const MenuImpl: ComponentImpl<Static<typeof MenuPropsSchema>> = props => {
  const { elementRef, customStyle, callbackMap, mergeState, defaultActiveKey } = props;
  const { items = [], ...cProps } = getComponentProps(props);
  const [activeKey, setActiveKey] = useState<string>(defaultActiveKey);

  useEffect(() => {
    mergeState({
      activeKey,
    });
  }, [activeKey, mergeState]);

  return (
    <BaseMenu
      ref={elementRef}
      defaultSelectedKeys={[defaultActiveKey]}
      className={css(customStyle?.content)}
      onClickMenuItem={key => {
        setActiveKey(key);
        callbackMap?.onClick?.();
      }}
      {...cProps}
    >
      {items.map(item => (
        <BaseMenu.Item key={item.key} disabled={item.disabled}>
          {item.text}
        </BaseMenu.Item>
      ))}
    </BaseMenu>
  );
};

const exampleProperties: Static<typeof MenuPropsSchema> = {
  mode: 'vertical',
  autoOpen: false,
  collapse: false,
  autoScrollIntoView: false,
  hasCollapseButton: false,
  items: [
    { key: 'key1', text: 'item1' },
    { key: 'key2', text: 'item2' },
  ],
  defaultActiveKey: 'key1',
};

export const Menu = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'menu',
    displayName: 'Menu',
    exampleProperties,
  },
  spec: {
    properties: MenuPropsSchema,
    state: MenuStateSchema,
    methods: {},
    slots: [],
    styleSlots: ['content'],
    events: ['onClick'],
  },
})(MenuImpl);
