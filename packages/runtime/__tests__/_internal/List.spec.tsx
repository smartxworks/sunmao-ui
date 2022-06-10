import '@testing-library/jest-dom/extend-expect';
import { Application } from '@sunmao-ui/core';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { initSunmaoUI } from '../../src';
import { clearTesterMap } from '../../src/components/test/Tester';

const ListSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'list',
        type: 'core/v1/list',
        properties: {
          listData: [
            {
              id: 'foo',
            },
            {
              id: 'bar',
            },
            {
              id: 'baz',
            },
          ],
        },
        traits: [],
      },
      {
        id: 'tester',
        type: 'test/v1/tester',
        properties: {
          text: '{{$slot.$listItem.id}}',
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'list',
                slot: 'content',
              },
            },
          },
        ],
      },
    ],
  },
};

const ListEventSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: {
    name: 'some App',
  },
  spec: {
    components: [
      {
        id: 'list',
        type: 'core/v1/list',
        properties: {
          listData: [
            {
              id: 'foo',
            },
            {
              id: 'bar',
            },
            {
              id: 'baz',
            },
          ],
        },
        traits: [],
      },
      {
        id: 'button',
        type: 'test/v1/button',
        properties: {},
        traits: [
          {
            type: 'core/v1/slot',
            properties: {
              container: {
                id: 'list',
                slot: 'content',
              },
            },
          },
          {
            type: 'core/v1/event',
            properties: {
              handlers: [
                {
                  type: 'click',
                  componentId: 'state',
                  method: {
                    name: 'setValue',
                    parameters: {
                      key: 'value',
                      value: '{{state.value}}{{$slot.$listItem.id}}',
                    },
                  },
                  disabled: false,
                  wait: {
                    type: 'delay',
                    time: 0,
                  },
                },
              ],
            },
          },
        ],
      },
      {
        id: 'state',
        type: 'core/v1/dummy',
        properties: {},
        traits: [
          {
            type: 'core/v1/state',
            properties: {
              key: 'value',
            },
          },
        ],
      },
      {
        id: 'tester',
        type: 'test/v1/tester',
        properties: {
          text: '{{state.value}}',
        },
        traits: [],
      },
    ],
  },
};

describe('Core List Component', () => {
  const { App, stateManager } = initSunmaoUI();
  stateManager.noConsoleError = true;
  it('can render component directly', () => {
    const { unmount } = render(<App options={ListSchema} />);

    expect(screen.getByTestId('list_tester_0-text')).toHaveTextContent('foo');
    expect(screen.getByTestId('list_tester_1-text')).toHaveTextContent('bar');
    expect(screen.getByTestId('list_tester_2-text')).toHaveTextContent('baz');
    unmount();
    clearTesterMap();
  });

  it('can add event to list items', () => {
    const { unmount } = render(<App options={ListEventSchema} />);

    fireEvent.click(screen.getByTestId('list_button_0'));
    fireEvent.click(screen.getByTestId('list_button_1'));
    fireEvent.click(screen.getByTestId('list_button_2'));
    expect(screen.getByTestId('tester-text')).toHaveTextContent('foobarbaz');
    unmount();
    clearTesterMap();
  });
});
