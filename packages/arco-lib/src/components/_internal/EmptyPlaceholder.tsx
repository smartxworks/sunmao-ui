import { Typography } from '@arco-design/web-react';
import React from 'react';

const EmptyPlaceholder: React.FC<{ message?: string | React.ReactNode }> = ({
  message,
}) => {
  return (
    <Typography.Paragraph style={{ color: '#b2b2b2' }}>
      {message || 'Slot content is empty.Please drag component to this slot.'}
    </Typography.Paragraph>
  );
};

export { EmptyPlaceholder };
