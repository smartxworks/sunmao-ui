import { Steps as BaseSteps } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import {
  StepsPropsSchema as BaseStepsPropsSchema,
  StepItemSchema,
} from "../generated/types/Steps";
import { isArray } from "lodash-es";

const StepsPropsSchema = Type.Object(BaseStepsPropsSchema);
const StepsStateSchema = Type.Object({});

type StepItem = Static<typeof StepItemSchema>;

const StepsImpl: ComponentImpl<Static<typeof StepsPropsSchema>> = (props) => {
  const { items, ...cProps } = getComponentProps(props);
  const { customStyle, slotsElements } = props;

  return (
    <BaseSteps className={css(customStyle?.content)} {...cProps}>
      {items &&
        items.map((stepItem: StepItem, idx: number) => {
          return (
            <BaseSteps.Step
              icon={isArray(slotsElements.icons) && slotsElements.icons[idx]}
              key={idx}
              title={stepItem.title}
              description={stepItem.description}
            />
          );
        })}
    </BaseSteps>
  );
};

const exampleProperties: Static<typeof StepsPropsSchema> = {
  type: "default",
  size: "default",
  direction: "horizontal",
  labelPlacement: "vertical",
  status: "finish",
  current: 2,
  lineless: false,
  items: [
    { title: "Succeeded", description: "This is a description" },
    { title: "Processing",description:'' },
    { title: "Pending", description: "This is a description" },
  ],
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "steps",
    displayName: "Steps",
    exampleProperties,
    annotations: {
      category: "Display",
    }
  },
  spec: {
    properties: StepsPropsSchema,
    state: StepsStateSchema,
    methods: {},
    slots: ["icons"],
    styleSlots: ["content"],
    events: [],
  },
};

export const Steps = implementRuntimeComponent(options)(StepsImpl);
