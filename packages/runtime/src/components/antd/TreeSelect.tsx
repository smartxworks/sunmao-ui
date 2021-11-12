import { useState, useEffect } from 'react';
import { createComponent } from '@meta-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { uniq } from 'lodash-es';
import { TreeSelect } from 'antd';
import { Box } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { ComponentImplementation } from '../../services/registry';
import 'antd/lib/select/style/index.css';
import 'antd/lib/empty/style/index.css';
import 'antd/lib/tree-select/style/index.css';
import 'antd/lib/style/index.css';
import { useRef } from 'react';

const StateSchema = Type.Object({
  value: Type.String(),
});

const TreeSelectImpl: ComponentImplementation<Static<typeof PropsSchema>> = ({
  treeData,
  placeholder,
  mergeState,
  customStyle,
  multiple,
  treeDefaultExpandAll,
  autoSelectAncestors,
}) => {
  const [value, setValue] = useState<string[]>();
  const popContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    mergeState({ value });
  }, [value]);

  function getAncestors(value: string): string[] {
    let ans: string[] = [];

    function traverse(tree: Static<typeof TreeDataSchema>, prev: string[] = []) {
      tree.forEach(node => {
        if (!node.children) return;
        const next = prev.concat([node.value]);
        if (node.children?.find(child => child.value === value)) {
          ans = next;
          return;
        }
        traverse(node.children, next);
      });
    }

    traverse(treeData);
    return ans;
  }

  const onChange = (value: string[]) => {
    let newValue = value;
    if (autoSelectAncestors) {
      const valueWithAncestors = value.reduce<string[]>((res, val) => {
        return res.concat([val]).concat(getAncestors(val));
      }, []);
      newValue = uniq(valueWithAncestors);
    }
    setValue(newValue);
    mergeState({ newValue });
  };

  return (
    <Box
      width="full"
      css={css`
        ${customStyle?.content}
      `}
      ref={popContainerRef}
    >
      <TreeSelect
        multiple={multiple}
        treeData={treeData}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ width: '100%' }}
        treeDefaultExpandAll={treeDefaultExpandAll}
        getPopupContainer={() => popContainerRef.current || document.body}
      />
    </Box>
  );
};

const TreeDataSchema = Type.Array(
  Type.Rec(Self =>
    Type.Object({
      title: Type.String(),
      value: Type.String(),
      key: Type.String(),
      children: Type.Optional(Type.Array(Self)),
    })
  )
);

const PropsSchema = Type.Object({
  treeData: TreeDataSchema,
  multiple: Type.Boolean(),
  placeholder: Type.Optional(Type.String()),
  treeDefaultExpandAll: Type.Boolean(),
  autoSelectAncestors: Type.Optional(Type.Boolean()),
});

const exampleProperties = {
  treeData: [
    {
      title: 'Development',
      value: 'Development',
      key: 'Development',
      children: [
        {
          title: 'FrontEnd',
          value: 'FrontEnd',
          key: 'FrontEnd',
          children: [
            {
              title: 'React',
              value: 'React',
              key: 'React',
            },
            {
              title: 'Angular',
              value: 'Angular',
              key: 'Angular',
            },
          ],
        },
        {
          title: 'BackEnd',
          value: 'BackEnd',
          key: 'BackEnd',
        },
        {
          title: 'Design',
          value: 'Design',
          key: 'Design',
          children: [
            {
              title: 'figma',
              value: 'figma',
              key: 'figma',
            },
            {
              title: 'sketch',
              value: 'sketch',
              key: 'sketch',
            },
          ],
        },
      ],
    },
    {
      title: 'Others',
      value: 'Others',
      key: 'Others',
    },
  ],
};

export default {
  ...createComponent({
    version: 'antd/v1',
    metadata: {
      name: 'treeSelect',
      displayName: 'treeSelect',
      description: 'antd treeSelect',
      isResizable: true,
      isDraggable: true,
      exampleProperties,
      exampleSize: [4, 1],
    },
    spec: {
      properties: PropsSchema,
      state: StateSchema,
      methods: [],
      slots: [],
      styleSlots: [],
      events: [],
    },
  }),
  impl: TreeSelectImpl,
};
