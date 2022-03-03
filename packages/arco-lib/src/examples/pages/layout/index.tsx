import { Divider, Typography } from '@arco-design/web-react';
import { DemoWrapper } from '../../DemoWrapper';
import layoutWithMenu from './layoutWithMenu';

export const LayoutDemoPage: React.FC = () => {
  return (
    <div>
      <Typography.Title heading={3}>Layout with menu</Typography.Title>
      <DemoWrapper application={layoutWithMenu} />
      <Divider />
    </div>
  );
};
