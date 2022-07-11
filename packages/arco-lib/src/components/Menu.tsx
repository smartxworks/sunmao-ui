import { Menu as BaseMenu } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { MenuPropsSpec as BaseMenuPropsSpec } from '../generated/types/Menu';
import { useEffect } from 'react';
import { useStateValue } from '../hooks/useStateValue';

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
  ellipsis: false,
  defaultActiveKey: 'key1',
  updateWhenDefaultValueChanges: false,
};

export const Menu = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'menu',
    displayName: 'Menu',
    exampleProperties,
    annotations: {
      category: 'Navigation',
    },
  },
  spec: {
    properties: MenuPropsSpec,
    state: MenuStateSpec,
    methods: {
      setActive: Type.Object({
        active: Type.String(),
      }),
    },
    slots: {},
    styleSlots: ['content'],
    events: ['onClick'],
  },
})(props => {
  const { elementRef, customStyle, callbackMap, mergeState, subscribeMethods } = props;
  const {
    items = [],
    defaultActiveKey,
    collapse,
    hasCollapseButton,
    updateWhenDefaultValueChanges,
    ...cProps
  } = getComponentProps(props);

  const [activeKey, setActiveKey] = useStateValue(
    defaultActiveKey ?? 0,
    mergeState,
    updateWhenDefaultValueChanges,
    'activeKey'
  );

  useEffect(() => {
    subscribeMethods({
      setActive: ({ active }) => {
        setActiveKey(active);
        mergeState({ activeKey: active });
      },
    });
  }, [mergeState, setActiveKey, subscribeMethods]);

  return (
    <BaseMenu
      ref={elementRef}
      selectedKeys={[activeKey]}
      className={css(customStyle?.content)}
      onClickMenuItem={key => {
        setActiveKey(key);
        mergeState({
          activeKey: key,
        });
        callbackMap?.onClick?.();
      }}
      collapse={hasCollapseButton ? undefined : collapse}
      hasCollapseButton={hasCollapseButton}
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
