import { Divider, Typography } from '@arco-design/web-react';
import { DemoWrapper } from '../../DemoWrapper';
import tabBasicUsage from './basicUsage';

export const TabDemoPage: React.FC = () => {
  return (
    <div>
      <Typography.Title heading={3}>Basic Usage</Typography.Title>
      <DemoWrapper application={tabBasicUsage} />
      <Divider />
    </div>
  );
};
