import { Tree as BaseTree } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA } from "../sunmao-helper";
import { TreePropsSchema, TreeNodeSchema } from "../generated/types/Tree";
import { useEffect, useState } from "react";
import { NodeInstance } from "@arco-design/web-react/es/Tree/interface";

const TreeStateSchema = Type.Object({
  selectedNode: TreeNodeSchema,
  selectedNodes: Type.Array(TreeNodeSchema),
});

const TreeImpl: ComponentImpl<Static<typeof TreePropsSchema>> = (props) => {
  const {
    elementRef,
    data,
    multiple,
    autoExpandParent,
    customStyle,
    mergeState,
  } = props;
  const [selectedNodes, setSelectedNodes] = useState<
    Static<typeof TreeNodeSchema>[]
  >([]);

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
};

function formatNode(node: NodeInstance): Static<typeof TreeNodeSchema> {
  return {
    title: node.props.title as string,
    key: node.props._key!,
    selectable: node.props.selectable,
    checkable: node.props.checkable,
    children:
      node.props.dataRef?.children || ([] as Static<typeof TreeNodeSchema>[]),
  };
}

const exampleProperties: Static<typeof TreePropsSchema> = {
  multiple: false,
  size: "medium",
  autoExpandParent: true,
  data: [
    {
      title: "Asia",
      key: "asia",
      children: [
        {
          title: "China",
          key: "China",
          selectable: false,
          children: [
            {
              title: "Guangdong",
              key: "Guangdong",
              children: [
                {
                  title: "Guangzhou",
                  key: "Guangzhou",
                },
                {
                  title: "Shenzhen",
                  key: "Shenzhen",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Europe",
      key: "Europe",
      children: [
        {
          title: "France",
          key: "France",
        },
        {
          title: "Germany",
          key: "Germany",
        },
      ],
    },
  ],
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "tree",
    displayName: "Tree",
    annotations: {
      category: "Display",
    },
    exampleProperties,
  },
  spec: {
    properties: TreePropsSchema,
    state: TreeStateSchema,
    methods: {},
    slots: [],
    styleSlots: ["content"],
    events: [],
  },
};

export const Tree = implementRuntimeComponent(options)(TreeImpl);
