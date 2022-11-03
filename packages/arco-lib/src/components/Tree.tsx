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
  selectedNode: TreeNodeSpec,
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

  // autoExpandParent
  useEffect(() => {
    if (autoExpandParent) {
      setExpandKeys(treeRef.current?.getInitExpandedKeys(undefined));
    }
  }, [autoExpandParent]);

  useEffect(() => {
    setExpandKeys(defaultExpandKeys);
  }, [defaultExpandKeys]);

  useEffect(() => {
    if (Array.isArray(data)) {
      // reset tree state
      const treeState = treeRef.current?.getTreeState();
      const selectedKeys = treeState?.selectedKeys;
      const selectedData = data.filter(d => selectedKeys?.includes(d.key));
      const selectedNodes = treeRef.current?.getNodeList(selectedData).map(formatNode);

      mergeState({
        selectedKeys: selectedData.map(d => d.key),
        selectedNode: selectedNodes?.[0],
        selectedNodes: selectedNodes,
      });

      // auto expand parent
      if (autoExpandParentWhenDataChanges && autoExpandParent) {
        treeRef.current?.getNodeList(data);
        setExpandKeys(treeRef.current?.getInitExpandedKeys(undefined));
      }
    } else {
      mergeState({
        selectedKeys: [],
        selectedNode: undefined,
        selectedNodes: [],
      });
    }
  }, [autoExpandParent, autoExpandParentWhenDataChanges, data, mergeState]);

  const onSelect = useCallback(
    (
      selectedKeys: string[],
      extra: {
        selected: boolean;
        selectedNodes: NodeInstance[];
        node: NodeInstance;
        e: Event;
      }
    ) => {
      // In multi-select mode, select an item, remove it from data, and select an item again. Two items will be selected at the same time
      // Think it's a bug in the arco tree
      const selectNodes = extra.selectedNodes
        .filter(node => node)
        .map(node => formatNode(node.props));

      mergeState({
        selectedKeys: selectNodes.map(node => node.key),
        selectedNode: selectNodes[0],
        selectedNodes: selectNodes,
      });
      callbackMap?.onSelect?.();
    },
    [mergeState, callbackMap]
  );

  return (
    <div ref={elementRef} className={css(customStyle?.content)}>
      <BaseTree
        ref={treeRef}
        expandedKeys={expandKeys}
        treeData={data}
        multiple={multiple}
        autoExpandParent={autoExpandParent}
        onSelect={onSelect}
      />
    </div>
  );
});
