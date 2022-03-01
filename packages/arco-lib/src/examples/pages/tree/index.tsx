import { Divider, Typography } from "@arco-design/web-react";
import { DemoWrapper } from "../../DemoWrapper";
import basicUsage from "./basicUsage";

export const TreeDemoPage: React.FC = () => {
  return (
    <div>
      <Typography.Title heading={3}>Basic Usage</Typography.Title>
      <DemoWrapper application={basicUsage} />
      <Divider />
    </div>
  );
};
