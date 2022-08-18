import '@testing-library/jest-dom/extend-expect';
import { Application, createModule, RuntimeModule } from '@sunmao-ui/core';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { initSunmaoUI } from '../../src';
import { clearTesterMap } from '../testLib/Tester';
import { TestLib } from '../testLib';

const ModuleSchema: RuntimeModule = createModule({
  version: 'custom/v1',
  metadata: { name: 'myModule0', description: 'my module' },
  spec: {
    stateMap: { data: '{{ $moduleId }}__input.value' },
    events: ['onClickButton'],
    properties: {},
    exampleProperties: { defaultValue: 'foo' },
  },
  impl: [
    {
      id: '{{ $moduleId }}__button',
      type: 'test/v1/button',
      properties: {},
      traits: [
        {
          type: 'core/v1/event',
          properties: {
            handlers: [
              {
                type: 'click',
                componentId: '$module',
                method: {
                  name: 'onClickButton',
                  parameters: {
                    moduleId: '{{$moduleId}}',
                  },
                },
                disabled: false,
                wait: { type: 'delay', time: 0 },
              },
            ],
          },
        },
      ],
    },
    {
      id: '{{ $moduleId }}__input',
      type: 'test/v1/input',
      properties: { defaultValue: '{{defaultValue}}' },
      traits: [],
    },
  ],
});

const ApplicationSchema: Application = {
  version: 'sunmao/v1',
  kind: 'Application',
  metadata: { name: 'some App' },
  spec: {
    components: [
      {
        id: 'moduleContainer',
        type: 'core/v1/moduleContainer',
        properties: {
          id: 'myModule',
          type: 'custom/v1/myModule0',
          properties: { defaultValue: 'foo' },
          handlers: [
            {
              type: 'onClickButton',
              componentId: 'state',
              method: {
                name: 'setValue',
                parameters: { key: 'value', value: '{{myModule.data}}' },
              },
            },
            {
              type: 'onClickButton',
              componentId: '$utils',
              method: {
                name: 'chakra_ui/v1/openToast',
                parameters: {
                  position: 'top',
                  duration: 1000,
                  title: '{{myModule.data}}',
                  description: '',
                  isClosable: false,
                  variant: 'subtle',
                  status: 'info',
                  id: '',
                },
              },
            },
          ],
        },
        traits: [],
      },
      {
        id: 'state',
        type: 'core/v1/dummy',
        properties: {},
        traits: [{ type: 'core/v1/state', properties: { key: 'value' } }],
      },
      {
        id: 'tester',
        type: 'test/v1/tester',
        properties: { text: '{{myModule.data}}' },
        traits: [],
      },
      {
        id: 'tester2',
        type: 'test/v1/tester',
        properties: { text: '{{state.value}}' },
        traits: [],
      },
    ],
  },
};
describe('ModuleRenderer', () => {
  const { App, stateManager, registry } = initSunmaoUI({ libs: [TestLib] });
  registry.registerModule(ModuleSchema);
  stateManager.mute = true;
  it('can accept properties', () => {
    const { rerender, unmount } = render(<App options={ApplicationSchema} />);
    expect(screen.getByTestId('myModule__input')).toHaveValue('foo');
    unmount();
    clearTesterMap();
  });

  it('can expose state', () => {
    const { rerender, unmount } = render(<App options={ApplicationSchema} />);
    expect(screen.getByTestId('tester-text')).toHaveTextContent('foo');

    fireEvent.change(screen.getByTestId('myModule__input'), { target: { value: 'bar' } });
    expect(screen.getByTestId('myModule__input')).toHaveValue('bar');
    expect(screen.getByTestId('tester-text')).toHaveTextContent('bar');
    unmount();
    clearTesterMap();
  });

  it('can expose event', () => {
    const { rerender, unmount } = render(<App options={ApplicationSchema} />);
    fireEvent.change(screen.getByTestId('myModule__input'), { target: { value: 'baz' } });
    fireEvent.click(screen.getByTestId('myModule__button'));
    expect(screen.getByTestId('tester2-text')).toHaveTextContent('baz');
    unmount();
    clearTesterMap();
  });
});
