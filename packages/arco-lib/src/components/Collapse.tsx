import { Collapse as BaseCollapse } from '@arco-design/web-react';
import { ComponentImpl, implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import {
  CollapsePropsSpec as BaseCollapsePropsSpec,
  CollapseItemPropsSpec as BaseCollapseItemPropsSpec,
} from '../generated/types/Collapse';
import { useEffect, useState } from 'react';

const CollapsePropsSpec = Type.Object(BaseCollapsePropsSpec);
const CollapseStateSpec = Type.Object({
  activeKey: Type.Array(Type.String()),
});

const CollapseImpl: ComponentImpl<Static<typeof CollapsePropsSpec>> = props => {
  const { defaultActiveKey, ...cProps } = getComponentProps(props);
  const { elementRef, mergeState, slotsElements, customStyle, callbackMap } = props;

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
      ref={elementRef}
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
const exampleProperties: Static<typeof CollapsePropsSpec> = {
  defaultActiveKey: ['1'],
  accordion: false,
  expandIconPosition: 'left',
  bordered: false,
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'collapse',
    displayName: 'Collapse',
    exampleProperties,
  },
  spec: {
    properties: CollapsePropsSpec,
    state: CollapseStateSpec,
    methods: {
      setActiveKey: Type.String(),
    },
    slots: ['collapseItems'],
    styleSlots: ['content'],
    events: [],
  },
};

export const Collapse = implementRuntimeComponent(options)(
  CollapseImpl as typeof CollapseImpl & undefined
);

const CollapseItemPropsSpec = Type.Object(BaseCollapseItemPropsSpec);
const CollapseItemStateSpec = Type.Object({});

const CollapseItemImpl: ComponentImpl<Static<typeof CollapseItemPropsSpec>> = props => {
  const { elementRef, name, ...cProps } = getComponentProps(props);
  const { slotsElements, customStyle } = props;

  return (
    <BaseCollapse.Item
      ref={elementRef}
      name={String(name)}
      className={css(customStyle?.content)}
      {...cProps}
    >
      {slotsElements.content}
    </BaseCollapse.Item>
  );
};

export const CollapseItem = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'CollapseItem',
    displayName: 'CollapseItem',
    exampleProperties: {
      name: '1',
      disabled: false,
      showExpandIcon: true,
      destroyOnHide: true,
      header: 'header',
    },
  },
  spec: {
    properties: CollapseItemPropsSpec,
    state: CollapseItemStateSpec,
    methods: {},
    slots: ['content'],
    styleSlots: ['content'],
    events: ['onChange'],
  },
})(CollapseItemImpl);
