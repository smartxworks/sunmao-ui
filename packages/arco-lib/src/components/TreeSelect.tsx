import { TreeSelect as BaseTreeSelect } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import {
  TreeSelectPropsSchema as BaseTreeSelectPropsSchema,
  TreeSelectValueSchema,
} from "../generated/types/TreeSelect";
import { useState, useEffect } from "react";

const TreeSelectPropsSchema = Type.Object(BaseTreeSelectPropsSchema);
const TreeSelectStateSchema = Type.Object({
  value: Type.String(),
});

type TreeSelectValue = Static<typeof TreeSelectValueSchema>;

const TreeSelectImpl: ComponentImpl<Static<typeof TreeSelectPropsSchema>> = (
  props
) => {
  const { defaultValue, ...cProps } = getComponentProps(props);
  const { customStyle, className, mergeState } = props;

  const [value, setValue] = useState<TreeSelectValue>(defaultValue!);

  useEffect(() => {
    mergeState({ value });
  }, [mergeState, value]);

  const handleChange = (value: TreeSelectValue) => {
    setValue(value);
  };

  const filterTreeNode = (inputText: string, treeNode: any) => {
    return (
      treeNode.props.title.toLowerCase().indexOf(inputText.toLowerCase()) > -1
    );
  };

  return (
    <BaseTreeSelect
      onChange={handleChange}
      className={cx(className, css(customStyle?.content))}
      filterTreeNode={filterTreeNode}
      {...cProps}
      value={value}
    ></BaseTreeSelect>
  );
};

const exampleProperties: Static<typeof TreeSelectPropsSchema> = {
  unmountOnExit: false,
  treeCheckable: false,
  defaultValue: "node1",
  treeData: [
    {
      key: "node1",
      title: "Trunk",
      disabled: true,
      children: [
        {
          key: "node2",
          title: "Leaf1",
        },
      ],
    },
    {
      key: "node3",
      title: "Trunk2",
      children: [
        {
          key: "node4",
          title: "Leaf2",
        },
        {
          key: "node5",
          title: "Leaf3",
        },
      ],
    },
  ],
  treeCheckStrictly: false,
  bordered: false,
  placeholder: "please ...",
  className: "",
  labelInValue: true,
  size: "default",
  disabled: false,
  error: false,
  showSearch: true,
  loading: false,
  allowClear: true,
  allowCreate: true,
  maxTagCount: 20,
  animation: false,
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "TreeSelect",
    displayName: "TreeSelect",
    exampleProperties,
  },
  spec: {
    properties: TreeSelectPropsSchema,
    state: TreeSelectStateSchema,
    methods: {},
    slots: [],
    styleSlots: ["content"],
    events: [],
  },
};

export const TreeSelect = implementRuntimeComponent(options)(
  TreeSelectImpl as typeof TreeSelectImpl & undefined
);
