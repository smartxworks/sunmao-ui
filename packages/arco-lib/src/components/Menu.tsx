import { Menu as BaseMenu } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { MenuPropsSpec as BaseMenuPropsSpec } from '../generated/types/Menu';
import { useEffect, useState } from 'react';

const MenuPropsSpec = Type.Object({
  ...BaseMenuPropsSpec,
});
const MenuStateSpec = Type.Object({
  activeKey: Type.Optional(Type.String()),
});

const exampleProperties: Static<typeof MenuPropsSpec> = {
  mode: 'vertical',
  autoOpen: false,
  collapse: false,
  autoScrollIntoView: false,
  hasCollapseButton: false,
  items: [
    { key: 'key1', text: 'item1' },
    { key: 'key2', text: 'item2' },
  ],
  ellipsis:false,
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
    properties: MenuPropsSpec,
    state: MenuStateSpec,
    methods: {},
    slots: [],
    styleSlots: ['content'],
    events: ['onClick'],
  },
})(props => {
  const { elementRef, customStyle, callbackMap, mergeState } = props;
  const { items = [], defaultActiveKey, ...cProps } = getComponentProps(props);
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
});
