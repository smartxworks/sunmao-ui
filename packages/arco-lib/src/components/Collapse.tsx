import { Collapse as BaseCollapse } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { CollapsePropsSpec as BaseCollapsePropsSpec } from '../generated/types/Collapse';
import { useCallback } from 'react';
import { EmptyPlaceholder } from './_internal/EmptyPlaceholder';
import { useStateValue } from '../hooks/useStateValue';

const CollapsePropsSpec = Type.Object(BaseCollapsePropsSpec);
const CollapseStateSpec = Type.Object({
  activeKey: Type.Array(Type.String()),
});

const exampleProperties: Static<typeof CollapsePropsSpec> = {
  defaultActiveKey: ['1'],
  options: [
    {
      key: '1',
      header: 'header 1',
      disabled: false,
      showExpandIcon: true,
    },
    {
      key: '2',
      header: 'header 2',
      disabled: false,
      showExpandIcon: true,
    },
  ],
  updateWhenDefaultValueChanges: false,
  accordion: false,
  expandIconPosition: 'left',
  bordered: false,
  destroyOnHide: false,
  lazyLoad: true,
};

export const Collapse = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'collapse',
    displayName: 'Collapse',
    exampleProperties,
    annotations: {
      category: 'Data Display',
    },
  },
  spec: {
    properties: CollapsePropsSpec,
    state: CollapseStateSpec,
    methods: {},
    slots: {
      content: {
        slotProps: Type.Object({
          activeKey: Type.Array(Type.String()),
          index: Type.Number(),
        }),
      },
    },
    styleSlots: ['content'],
    events: ['onChange'],
  },
})(props => {
  const { defaultActiveKey, options, updateWhenDefaultValueChanges, ...cProps } =
    getComponentProps(props);
  const { elementRef, mergeState, slotsElements, customStyle, callbackMap } = props;

  const [activeKey, setActiveKey] = useStateValue(
    defaultActiveKey,
    mergeState,
    updateWhenDefaultValueChanges,
    'activeKey'
  );

  const onChange = useCallback(
    (currentOperateKey: string, activeKey: string[]) => {
      setActiveKey(activeKey);
      mergeState({ activeKey });
      callbackMap?.onChange?.();
    },
    [callbackMap, mergeState, setActiveKey]
  );

  return (
    <BaseCollapse
      ref={elementRef}
      className={css(customStyle?.content)}
      {...cProps}
      activeKey={activeKey}
      onChange={onChange}
    >
      {options.map((o, index) => {
        const { key, ...props } = o;
        return (
          <BaseCollapse.Item key={key} name={String(key)} {...props}>
            {slotsElements?.content?.(
              { activeKey, index },
              <EmptyPlaceholder />,
              `content_${index}`
            ) || <EmptyPlaceholder />}
          </BaseCollapse.Item>
        );
      })}
    </BaseCollapse>
  );
});
