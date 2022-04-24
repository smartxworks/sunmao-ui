import { Divider, Typography } from '@arco-design/web-react';
import { DemoWrapper } from '../../DemoWrapper';
import basicUsage from './basicUsage';
import avatarUsage from './withAvatar';

export const DropdownDemoPage: React.FC = () => {
  return (
    <div>
      <Typography.Title heading={3}>Basic Usage</Typography.Title>
      <DemoWrapper application={basicUsage} />
      <Divider />
      <Typography.Title heading={3}>Dropdown With Avatar</Typography.Title>
      <DemoWrapper application={avatarUsage} />
      <Divider />
    </div>
  );
};
