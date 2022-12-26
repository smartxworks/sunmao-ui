import '@testing-library/jest-dom/extend-expect';
import { Application } from '@sunmao-ui/core';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { initSunmaoUI } from '../src';
import { clearTesterMap } from './testLib/Tester';
import { TestLib } from './testLib';

const V1SlotSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'stack0',
        type: 'core/v1/stack',
        properties: {
          spacing: 12,
          direction: 'horizontal',
          align: 'auto',
          wrap: false,
          justify: 'flex-start',
        },
        traits: [],
      },
      {
        id: 'text1',
        type: 'test/v1/tester',
        properties: {
          text: 'foo',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'stack0',
                slot: 'content',
              },
              ifCondition: '{{undefined}}',
            },
          },
        ],
      },
    ],
  },
};

const V2SlotSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'stack0',
        type: 'core/v1/stack',
        properties: {
          spacing: 12,
          direction: 'horizontal',
          align: 'auto',
          wrap: false,
          justify: 'flex-start',
        },
        traits: [],
      },
      {
        id: 'text1',
        type: 'test/v1/tester',
        properties: {
          text: 'foo',
        },
        traits: [
          {
            type: 'core/v2/slot',
            properties: {
              container: {
                id: 'stack0',
                slot: 'content',
              },
              ifCondition: '{{undefined}}',
            },
          },
        ],
      },
    ],
  },
};

describe('Test slot trait', () => {
  const { App, stateManager } = initSunmaoUI({ libs: [TestLib] });
  stateManager.mute = true;
  it('v1 slot tarit will render component when ifCondition is undefined', () => {
    const { unmount } = render(<App options={V1SlotSchema} />);

    expect(screen.getByTestId('text1-text')).toHaveTextContent('foo');
    unmount();
    clearTesterMap();
  });

  it('v2 slot tarit will not render component when ifCondition is undefined', () => {
    const { unmount } = render(<App options={V2SlotSchema} />);

    expect(() => screen.getByTestId('text1-text')).toThrowError();
    unmount();
    clearTesterMap();
  });
});
