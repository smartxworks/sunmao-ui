import { TreeSelect as BaseTreeSelect } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { TreeSelectPropsSpec as BaseTreeSelectPropsSpec } from '../generated/types/TreeSelect';
import { useEffect, useRef } from 'react';
import { RefTreeSelectType } from '@arco-design/web-react/es/TreeSelect';
import { useStateValue } from 'src/hooks/useStateValue';

const TreeSelectPropsSpec = Type.Object(BaseTreeSelectPropsSpec);
const TreeSelectStateSpec = Type.Object({
  selectedOptions: Type.Array(Type.String()),
});

const exampleProperties: Static<typeof TreeSelectPropsSpec> = {
  multiple: false,
  defaultValue: ['node1'],
  treeData: [
    {
      key: 'node1',
      title: 'Trunk',
      disabled: true,
      children: [
        {
          key: 'node2',
          title: 'Leaf1',
        },
      ],
    },
    {
      key: 'node3',
      title: 'Trunk2',
      disabled: false,
      children: [
        {
          key: 'node4',
          title: 'Leaf2',
        },
        {
          key: 'node5',
          title: 'Leaf3',
        },
      ],
    },
  ],
  bordered: true,
  placeholder: 'Select option(s)',
  labelInValue: true,
  size: 'default',
  disabled: false,
  error: false,
  showSearch: true,
  loading: false,
  allowClear: true,
  updateWhenDefaultValueChanges: false,
};

export const TreeSelect = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'treeSelect',
    displayName: 'TreeSelect',
    annotations: {
      category: 'Display',
    },
    exampleProperties,
  },
  spec: {
    properties: TreeSelectPropsSpec,
    state: TreeSelectStateSpec,
    methods: {},
    slots: [],
    styleSlots: ['content'],
    events: ['onChange'],
  },
})(props => {
  const { defaultValue, updateWhenDefaultValueChanges, ...cProps } =
    getComponentProps(props);
  const { getElement, customStyle, mergeState, callbackMap } = props;
  const ref = useRef<RefTreeSelectType | null>(null);

  const [selectedOptions, setSelectedOptions] = useStateValue<string[]>(
    defaultValue!,
    mergeState,
    updateWhenDefaultValueChanges,
    'selectedOptions'
  );

  useEffect(() => {
    // arco definition doesn't declare dom, but it actually has.
    const ele = (ref.current as any)?.dom;
    if (getElement && ele) {
      getElement(ele);
    }
  }, [getElement, ref]);

  const handleChange = (value: string[]) => {
    setSelectedOptions(value);
    mergeState({ selectedOptions });
    callbackMap?.onChange?.();
  };

  const filterTreeNode = (inputText: string, treeNode: any) => {
    return treeNode.props.title.toLowerCase().indexOf(inputText.toLowerCase()) > -1;
  };

  return (
    <BaseTreeSelect
      ref={ref}
      onChange={handleChange}
      className={css(customStyle?.content)}
      filterTreeNode={filterTreeNode}
      {...cProps}
      value={selectedOptions}
      treeCheckable={cProps.multiple}
    />
  );
});
