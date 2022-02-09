import { Radio as BaseRadio } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { RadioPropsSchema as BaseRadioPropsSchema } from "../generated/types/Radio";
import { useEffect, useState } from "react";

const RadioPropsSchema = Type.Object({
  ...BaseRadioPropsSchema,
});
const RadioStateSchema = Type.Object({
  checkedValue: Type.String(),
});

const RadioImpl: ComponentImpl<Static<typeof RadioPropsSchema>> = (props) => {
  const { customStyle, callbackMap, mergeState, subscribeMethods } = props;
  const { defaultCheckedValue, ...cProps } = getComponentProps(props);
  const [checkedValue, setCheckedValue] = useState<string>("");
  const [isInit, setIsInit] = useState(false);

  const onChange = (value: string) => {
    setCheckedValue(value);
    mergeState({ checkedValue: value });
    callbackMap?.onChange?.();
  };

  useEffect(() => {
    if (!isInit && defaultCheckedValue) {
      setCheckedValue(defaultCheckedValue);
      mergeState({ checkedValue: defaultCheckedValue });
    }

    setIsInit(true);
  }, [defaultCheckedValue, isInit]);
  useEffect(() => {
    subscribeMethods({
      setCheckedValue: ({ value: newCheckedValue }) => {
        setCheckedValue(newCheckedValue);
        mergeState({
          checkedValue: newCheckedValue,
        });
      },
    });
  }, [mergeState, subscribeMethods]);

  return (
    <BaseRadio.Group
      {...cProps}
      className={css(customStyle?.group)}
      value={checkedValue}
      onChange={onChange}
    ></BaseRadio.Group>
  );
};

const exampleProperties: Static<typeof RadioPropsSchema> = {
  options: [],
  type: "radio",
  defaultCheckedValue:'',
  direction: "horizontal",
  size: "default",
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "radio",
    displayName: "Radio",
    exampleProperties,
  },
  spec: {
    properties: RadioPropsSchema,
    state: RadioStateSchema,
    methods: {
      setCheckedValue: Type.Object({
        value: Type.String(),
      }),
    },
    slots: [],
    styleSlots: ["group"],
    events: ["onChange"],
  },
};

export const Radio = implementRuntimeComponent(options)(RadioImpl);
