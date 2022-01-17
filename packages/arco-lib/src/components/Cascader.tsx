import { Cascader as BaseCascader } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { CascaderPropsSchema as BaseCascaderPropsSchema } from "../generated/types/Cascader";

const CascaderPropsSchema = Type.Object(BaseCascaderPropsSchema);
const CascaderStateSchema = Type.Object({});

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
  const { placeholder, controlled, ...cProps } = getComponentProps(props);
  const {
    slotsElements,
    customStyle,
    className,
    options,
  } = props;

  const content = slotsElements.content && slotsElements.content[0];

  return (
    <BaseCascader
      className={cx(className, css(customStyle?.content))}
      {...cProps}
      options={convertArrToTree(options)}
      placeholder={placeholder}
    >
      {content}
    </BaseCascader>
  )
};

const CascaderExampleOptions = [
  ["北京", "朝阳", "大屯里"],
  ["北京", "海淀", "smartx"],
  ["北京", "昌平"],
  ["北京", "望京", "望京soho"],
  ["上海", "黄埔"],
  ["上海", "浦口", "川沙", "迪士尼"],
  ["江苏", "徐州"],
  ["江苏", "苏州", "姑苏"],
  ["江苏", "苏州", "工业园"],
  ["江苏", "南京", "秦淮", "雨花台", "安德门"],
  ["江苏", "南京", "秦淮", "雨花台", "铁心桥"],
];
const exampleProperties: Static<typeof CascaderPropsSchema> = {
  className: "",
  defaultValue: ["北京", "海淀", "smartx"],
  expandTrigger: "click",
  changeOnSelect: false,
  unmountOnExit: true,
  mode:'single' ,
  defaultPopupVisible: false,
  placeholder: "Please select ...",
  bordered: true,
  size: "default",
  showSearch:false,
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
    name: "Cascader",
    displayName: "Cascader",
    exampleProperties,
  },
  spec: {
    properties: CascaderPropsSchema,
    state: CascaderStateSchema,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: [],
  },
};

export const Cascader = implementRuntimeComponent(options)(
  CascaderImpl as typeof CascaderImpl & undefined
);
