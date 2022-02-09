import { Cascader as BaseCascader } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import {
  CascaderPropsSchema as BaseCascaderPropsSchema,
  CascaderValueSchema,
} from "../generated/types/Cascader";
import { useState, useEffect } from "react";
import { isArray } from "lodash-es";

const CascaderPropsSchema = Type.Object(BaseCascaderPropsSchema);
const CascaderStateSchema = Type.Object({
  value: CascaderValueSchema,
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
  const getTree: (map: MapItem) => CascaderOptions[] = (map) => {
    return Object.keys(map).map((key) => ({
      label: key,
      value: key,
      children: getTree(map[key]),
    }));
  };

  return getTree(map);
};

const CascaderImpl: ComponentImpl<Static<typeof CascaderPropsSchema>> = (
  props
) => {
  const { multiple, placeholder, ...cProps } = getComponentProps(props);
  const {
    mergeState,
    callbackMap,
    slotsElements,
    customStyle,
    className,
    options,
  } = props;

  const content = isArray(slotsElements.content)
    ? slotsElements.content[0]
    : slotsElements.content;

  const mode: "multiple" | undefined = multiple ? "multiple" : undefined;

  let defaultValue = cProps.defaultValue;
  if (mode === "multiple" && !Array.isArray(cProps.defaultValue[0])) {
    defaultValue = [cProps.defaultValue as string[]];
  }

  const [value, _setValue] = useState(defaultValue);

  // optimize the display when switching from single selection to multiple selection
  useEffect(() => {
    if (mode === "multiple" && !Array.isArray(value[0])) {
      _setValue([value as string[]]);
    }
  }, [mode]);

  useEffect(() => {
    mergeState({ value });
  }, [value, mergeState]);

  const onChange = (value: (string | string[])[]) => {
    _setValue(value);
    callbackMap?.onChange?.();
  };

  return (
    <BaseCascader
      className={cx(className, css(customStyle?.content))}
      {...cProps}
      mode={mode}
      onChange={onChange}
      value={value}
      options={convertArrToTree(options)}
      placeholder={placeholder}
    >
      {content}
    </BaseCascader>
  );
};

const CascaderExampleOptions = [
  ["beijing", "chaoyang", "datunli"],
  ["beijing", "haidian", "smartx"],
  ["beijing", "changping"],
  ["beijing", "wangjing", "soho"],
  ["shanghai", "huangpu"],
  ["shanghai", "pukou", "chuansha", "disney"],
  ["jiangsu", "nanjing", "qinhuai", "yuhuatai", "andemen"],
  ["jiangsu", "nanjing", "qinhuai", "yuhuatai", "tiexinqiao"],
];
const exampleProperties: Static<typeof CascaderPropsSchema> = {
  className: "",
  defaultValue: ["beijing", "haidian", "smartx"],
  expandTrigger: "click",
  changeOnSelect: false,
  unmountOnExit: true,
  multiple: false,
  defaultPopupVisible: false,
  placeholder: "Please select ...",
  bordered: true,
  size: "default",
  showSearch: false,
  disabled: false,
  error: false,
  loading: false,
  allowClear: true,
  allowCreate: true,
  maxTagCount: 99,
  animation: true,
  options: CascaderExampleOptions,
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "cascader",
    displayName: "Cascader",
    exampleProperties,
  },
  spec: {
    properties: CascaderPropsSchema,
    state: CascaderStateSchema,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: ["onChange"],
  },
};

export const Cascader = implementRuntimeComponent(options)(CascaderImpl);
