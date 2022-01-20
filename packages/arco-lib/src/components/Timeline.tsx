import { Timeline as BaseTimeline } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css, cx } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { TimelinePropsSchema as BaseTimelinePropsSchema } from "../generated/types/Timeline";

const TimelinePropsSchema = Type.Object(BaseTimelinePropsSchema);
const TimelineStateSchema = Type.Object({});

const TimelineImpl: ComponentImpl<Static<typeof TimelinePropsSchema>> = (
  props
) => {
  const { items, className, ...cProps } = getComponentProps(props);
  const { customStyle } = props;

  return (
    <BaseTimeline
      className={cx(className, css(customStyle?.content))}
      {...cProps}
    >
      {items?.map((item, idx) => (
        <BaseTimeline.Item
          key={idx}
          label={item.label}
          dotColor={item.dotColor}
          lineType={item.lineType}
          lineColor={item.lineColor}
          dotType={item.dotType}
        >
          {item.content}
        </BaseTimeline.Item>
      ))}
    </BaseTimeline>
  );
};
const exampleProperties: Static<typeof TimelinePropsSchema> = {
  className: "",
  reverse: false,
  direction: "vertical",
  mode: "alternate",
  labelPosition: "same",
  items: [
    {
      label: "2017-03-10",
      content: "The first milestone",
      dotColor: "#00B42A",
      lineType: "dashed",
      lineColor: "#00B42A",
      dotType: "hollow",
    },
    { label: "2018-05-12", content: "The second milestone" },
    {
      label: "2020-06-22",
      content: "The third milestone",
      dotColor: "#F53F3F",
      lineType: "dotted",
    },
    {
      label: "2020-09-30",
      content: "The fourth milestone",
      dotColor: "#C9CDD4",
    },
  ],
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "Timeline",
    displayName: "Timeline",
    exampleProperties,
  },
  spec: {
    properties: TimelinePropsSchema,
    state: TimelineStateSchema,
    methods: {},
    slots: [],
    styleSlots: ["content"],
    events: [],
  },
};

export const Timeline = implementRuntimeComponent(options)(TimelineImpl);
