import { Tree as BaseTree } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA } from '../sunmao-helper';
import { TreePropsSpec, TreeNodeSpec } from '../generated/types/Tree';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NodeInstance } from '@arco-design/web-react/es/Tree/interface';

const TreeStateSpec = Type.Object({
  selectedKeys: Type.Array(Type.String()),
  selectedNodes: Type.Array(TreeNodeSpec),
});

function formatNode(
  nodeProps: NodeInstance['props']
): Static<typeof TreeNodeSpec> & { path: string[] } {
  const { title, key, ...rest } = nodeProps.dataRef!;
  return {
    title: title as string,
    key: key!,
    selectable: nodeProps.selectable,
    checkable: nodeProps.checkable,
    path: [...nodeProps.pathParentKeys!, nodeProps._key!],
    children: nodeProps.dataRef?.children || ([] as Static<typeof TreeNodeSpec>[]),
    ...rest,
  };
}

const exampleProperties: Static<typeof TreePropsSpec> = {
  multiple: false,
  size: 'medium',
  autoExpandParent: true,
  defaultExpandKeys: [],
  autoExpandParentWhenDataChanges: false,
  data: [
    {
      title: 'Asia',
      key: 'asia',
      children: [
        {
          title: 'China',
          key: 'China',
          selectable: false,
          children: [
            {
              title: 'Guangdong',
              key: 'Guangdong',
              children: [
                {
                  title: 'Guangzhou',
                  key: 'Guangzhou',
                },
                {
                  title: 'Shenzhen',
                  key: 'Shenzhen',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Europe',
      key: 'Europe',
      children: [
        {
          title: 'France',
          key: 'France',
        },
        {
          title: 'Germany',
          key: 'Germany',
        },
      ],
    },
  ],
};

export const Tree = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'tree',
    displayName: 'Tree',
    annotations: {
      category: 'Data Display',
    },
    exampleProperties,
  },
  spec: {
    properties: TreePropsSpec,
    state: TreeStateSpec,
    methods: {},
    slots: {},
    styleSlots: ['content'],
    events: ['onSelect'],
  },
})(props => {
  const {
    elementRef,
    data,
    callbackMap,
    multiple,
    autoExpandParent,
    customStyle,
    mergeState,
    defaultExpandKeys,
    autoExpandParentWhenDataChanges,
  } = props;
  const treeRef = useRef<BaseTree>(null);
  const [expandKeys, setExpandKeys] = useState(defaultExpandKeys);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // init expanded keys
  useEffect(() => {
    if (autoExpandParent) {
      setExpandKeys(treeRef.current?.getInitExpandedKeys(undefined));
    } else {
      setExpandKeys(defaultExpandKeys);
    }
  }, [autoExpandParent, defaultExpandKeys]);

  useEffect(() => {
    if (Array.isArray(data)) {
      // reset tree state
      const treeState = treeRef.current?.getTreeState();
      const selectedKeys = treeState?.selectedKeys || [];

      const selectedNodes = selectedKeys
        .map(key => treeRef.current?.key2nodeProps[key])
        .filter(node => node)
        .map(node => formatNode(node!));

      mergeState({
        selectedKeys: selectedNodes.map(node => node.key),
        selectedNodes: selectedNodes,
      });

      // auto expand parent
      if (autoExpandParentWhenDataChanges && autoExpandParent) {
        setExpandKeys(treeRef.current?.getInitExpandedKeys(undefined));
      }
    } else {
      mergeState({
        selectedKeys: [],
        selectedNodes: [],
      });
    }
  }, [autoExpandParent, autoExpandParentWhenDataChanges, data, mergeState]);

  const onSelect = useCallback(
    (
      _selectedKeys: string[],
      extra: {
        selected: boolean;
        selectedNodes: NodeInstance[];
        node: NodeInstance;
        e: Event;
      }
    ) => {
      const selectedNodes = extra.selectedNodes
        .filter(node => node)
        .map(node => formatNode(node.props));
      const selectedKeys = selectedNodes.map(node => node.key);
      setSelectedKeys(selectedKeys);

      mergeState({
        selectedKeys: selectedKeys,
        selectedNodes: selectedNodes,
      });
      callbackMap?.onSelect?.();
    },
    [mergeState, callbackMap]
  );

  return (
    <div ref={elementRef} className={css(customStyle?.content)}>
      <BaseTree
        ref={treeRef}
        selectedKeys={selectedKeys}
        expandedKeys={expandKeys}
        treeData={data}
        multiple={multiple}
        autoExpandParent={autoExpandParent}
        onExpand={expandKeys => {
          setExpandKeys(expandKeys);
        }}
        onSelect={onSelect}
      />
    </div>
  );
});
