import { Radio as BaseRadio } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
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
  const { customStyle, callbackMap, mergeState, subscribeMethods } =
    props;
  const { defaultCheckedValue, elementRef, ...cProps } = getComponentProps(props);
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
    <div ref={elementRef}>
      <BaseRadio.Group
        {...cProps}
        className={css(customStyle?.group)}
        value={checkedValue}
        onChange={onChange}
      />
    </div>
  );
};

const exampleProperties: Static<typeof RadioPropsSchema> = {
  options: [
    { label: 'A', value: 'a',disabled: false },
    { label: 'B', value: 'b',disabled: true },
  ],
  type: "radio",
  defaultCheckedValue:'b',
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
    annotations: {
      category: "Input",
    }
  },
  spec: {
    properties: RadioPropsSchema,
    state: RadioStateSchema,
    methods: {
      setCheckedValue: Type.Object({
        value: Type.String(),
      }),
    } as Record<string, any>,
    slots: [],
    styleSlots: ["group"],
    events: ["onChange"],
  },
};

export const Radio = implementRuntimeComponent(options)(RadioImpl);
