import { Tree as BaseTree } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA } from '../sunmao-helper';
import { TreePropsSpec, TreeNodeSpec } from '../generated/types/Tree';
import { useEffect, useState } from 'react';
import { NodeInstance } from '@arco-design/web-react/es/Tree/interface';

const TreeStateSpec = Type.Object({
  selectedNode: TreeNodeSpec,
  selectedNodes: Type.Array(TreeNodeSpec),
});

function formatNode(node: NodeInstance): Static<typeof TreeNodeSpec> {
  return {
    title: node.props.title as string,
    key: node.props._key!,
    selectable: node.props.selectable,
    checkable: node.props.checkable,
    path: [...node.props.pathParentKeys!, node.props._key!],
    children: node.props.dataRef?.children || ([] as Static<typeof TreeNodeSpec>[]),
  };
}

const exampleProperties: Static<typeof TreePropsSpec> = {
  multiple: false,
  size: 'medium',
  autoExpandParent: true,
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

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'tree',
    displayName: 'Tree',
    annotations: {
      category: 'Display',
    },
    exampleProperties,
  },
  spec: {
    properties: TreePropsSpec,
    state: TreeStateSpec,
    methods: {},
    slots: [],
    styleSlots: ['content'],
    events: [],
  },
};

export const Tree = implementRuntimeComponent(options)(props => {
  const { elementRef, data, multiple, autoExpandParent, customStyle, mergeState } = props;
  const [selectedNodes, setSelectedNodes] = useState<Static<typeof TreeNodeSpec>[]>([]);

  useEffect(() => {
    mergeState({
      selectedNode: selectedNodes[0],
      selectedNodes: selectedNodes,
    });
  }, [mergeState, selectedNodes]);

  return (
    <div ref={elementRef} className={css(customStyle?.content)}>
      <BaseTree
        treeData={data}
        multiple={multiple}
        autoExpandParent={autoExpandParent}
        onSelect={(value, extra) => {
          setSelectedNodes(extra.selectedNodes.map(formatNode));
        }}
      />
    </div>
  );
});
