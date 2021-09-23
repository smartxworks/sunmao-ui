import { render } from '@testing-library/react';
import Text from '../../src/components/_internal/Text';
import React from 'react';

describe('Text component', () => {
  it('should render plain text', () => {
    const { queryByText } = render(
      <Text
        value={{
          raw: 'plain text',
          format: 'plain',
        }}></Text>
    );
    const ele = queryByText(/text/i);
    expect(ele).toBeTruthy();
    expect(ele.innerHTML).toMatchInlineSnapshot(`"plain text"`);
  });
  it('should render markdown text', () => {
    const { queryByText } = render(
      <Text
        value={{
          raw: '**plain** text',
          format: 'md',
        }}></Text>
    );
    const ele = queryByText(/text/i);
    expect(ele).toBeTruthy();
    expect(ele.innerHTML).toMatchInlineSnapshot(
      `"<strong>plain</strong> text"`
    );
  });
});
