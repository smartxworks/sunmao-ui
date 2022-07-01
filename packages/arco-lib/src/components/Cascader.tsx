import { Cascader as BaseCascader } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import {
  CascaderPropsSpec as BaseCascaderPropsSpec,
  CascaderValueSpec,
} from '../generated/types/Cascader';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SelectViewHandle } from '@arco-design/web-react/es/_class/select-view';

const CascaderPropsSpec = Type.Object(BaseCascaderPropsSpec);
const CascaderStateSpec = Type.Object({
  value: CascaderValueSpec,
});

type MapItem = {
  [k: string]: Record<string, MapItem>;
};

type CascaderOptions = {
  label: string;
  value: string;
  children?: CascaderOptions[];
};
const convertArrToTree = (arr: Array<Array<string>>) => {
  const map: MapItem = {};
  let node = map;

  // convert array to object, use the uniqueness of the object key
  for (let i = 0; i < arr.length; i++) {
    let j = 0;
    let currentNodeIdx = arr[i][j];
    if (!map[currentNodeIdx]) {
      map[currentNodeIdx] = {};
    }
    node = map;

    while (j < arr[i].length) {
      const parentNode = node[arr[i][j - 1]];
      currentNodeIdx = arr[i][j];
      if (parentNode) {
        if (!parentNode[currentNodeIdx]) {
          parentNode[currentNodeIdx] = {};
        }
        node = parentNode;
      }
      j++;
    }
  }

  // convert object to tree
  const getTree: (map: MapItem) => CascaderOptions[] = map => {
    return Object.keys(map).map(key => ({
      label: key,
      value: key,
      children: getTree(map[key]),
    }));
  };

  return getTree(map);
};

const CascaderExampleOptions = [
  ['Beijing', 'Dongcheng District', 'The Forbidden City'],
  ['Shanghai', 'Pukou', 'Disney'],
  ['Zhejiang', 'Hangzhou', 'The West Lake'],
];
const exampleProperties: Static<typeof CascaderPropsSpec> = {
  defaultValue: ['Zhejiang', 'Hangzhou', 'The West Lake'],
  expandTrigger: 'click',
  multiple: false,
  placeholder: 'Please select ...',
  bordered: true,
  size: 'default',
  showSearch: true,
  disabled: false,
  loading: false,
  allowClear: true,
  allowCreate: true,
  maxTagCount: 99,
  options: CascaderExampleOptions,
};

export const Cascader = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'cascader',
    displayName: 'Cascader',
    exampleProperties,
    annotations: {
      category: 'Data Entry',
    },
  },
  spec: {
    properties: CascaderPropsSpec,
    state: CascaderStateSpec,
    methods: {},
    slots: {
      content: { slotProps: Type.Object({}) },
    },
    styleSlots: ['content'],
    events: ['onChange'],
  },
})(props => {
  const { getElement, callbackMap, mergeState, slotsElements, customStyle } = props;

  const { multiple, options, placeholder, ...cProps } = getComponentProps(props);
  const ref = useRef<SelectViewHandle | null>(null);

  const content = slotsElements.content ? slotsElements.content({}) : null;

  const mode = multiple ? 'multiple' : undefined;

  let defaultValue = cProps.defaultValue;
  if (mode === 'multiple' && !Array.isArray(cProps.defaultValue[0])) {
    defaultValue = [cProps.defaultValue as string[]];
  }

  const [value, setValue] = useState<string[] | string[][]>(defaultValue);

  const convertValue = useMemo(() => {
    if (mode === 'multiple' && !Array.isArray(value[0])) {
      return [value as string[]];
    }
    return value;
  }, [value, mode]);

  useEffect(() => {
    const ele = ref.current?.dom;
    if (getElement && ele) {
      getElement(ele);
    }
  }, [getElement, ref]);

  const onChange = useCallback(
    (value: string[] | string[][]) => {
      setValue(value);
      mergeState({ value });
      callbackMap?.onChange?.();
    },
    [mergeState, callbackMap]
  );

  return (
    <BaseCascader
      ref={ref}
      className={css(customStyle?.content)}
      {...cProps}
      mode={mode}
      onChange={onChange as ((value: (string | string[])[]) => void) | undefined}
      value={convertValue}
      options={convertArrToTree(options)}
      placeholder={placeholder}
    >
      {content ? <div>{content}</div> : null}
    </BaseCascader>
  );
});
