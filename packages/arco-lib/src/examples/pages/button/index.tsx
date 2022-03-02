import { Divider, Typography } from "@arco-design/web-react";
import { DemoWrapper } from "../../DemoWrapper";
import basicUsage from "./basicUsage";
import buttonEvent from "./buttonEvent";
import buttonWithIcon from "./buttonWithIcon";
import buttonSize from "./buttonSize";
import buttonShape from "./buttonShape";
import buttonStatus from "./buttonStatus";
import longButton from "./longButton";

export const ButtonDemoPage: React.FC = () => {
  return (
    <div>
      <Typography.Title heading={3}>Basic Usage</Typography.Title>
      <DemoWrapper application={basicUsage} />
      <Divider />
      <Typography.Title heading={3}>Basic Event</Typography.Title>
      <DemoWrapper application={buttonEvent as any} />
      <Divider />
      <Typography.Title heading={3}>Button Sizes</Typography.Title>
      <DemoWrapper application={buttonSize as any} />
      <Divider />
      <Typography.Title heading={3}>Button With Icon</Typography.Title>
      <DemoWrapper application={buttonWithIcon as any} />
      <Divider />
      <Typography.Title heading={3}>Button Shape</Typography.Title>
      <DemoWrapper application={buttonShape as any} />
      <Divider />
      <Typography.Title heading={3}>Button Status</Typography.Title>
      <DemoWrapper application={buttonStatus as any} />
      <Divider />
      <Typography.Title heading={3}>Long Button</Typography.Title>
      <DemoWrapper application={longButton as any} />
      <Divider />
    </div>
  );
};
