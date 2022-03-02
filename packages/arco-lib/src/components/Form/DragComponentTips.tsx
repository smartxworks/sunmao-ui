import { Typography } from '@arco-design/web-react';

const DragComponentTips: React.FC<{ componentName: string }> = ({ componentName }) => {
  return (
    <Typography.Paragraph style={{ color: '#b2b2b2' }}>
      Please drag{' '}
      <Typography.Text bold style={{ color: '#777' }}>
        {componentName}
      </Typography.Text>{' '}
      components here
    </Typography.Paragraph>
  );
};

export { DragComponentTips };
