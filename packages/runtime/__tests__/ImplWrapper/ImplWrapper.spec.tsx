import '@testing-library/jest-dom';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import produce from 'immer';
import { times } from 'lodash';
import { initSunmaoUI } from '../../src';
import { destroyTimesMap } from '../../src/components/test/Tester';
import { renderTimesMap } from '../../src/components/test/Tester';
import {
  SingleComponentSchema,
  ComponentSchemaChangeSchema,
  HiddenTraitSchema,
  MergeStateSchema,
} from './mockSchema.spec';

const SingleComponentRenderTimes = '2';

function clear() {
  for (const key in renderTimesMap) {
    delete renderTimesMap[key];
  }
  for (const key in destroyTimesMap) {
    delete destroyTimesMap[key];
  }
}

describe('single component condition', () => {
  it('only render one time', () => {
    const { App } = initSunmaoUI();
    const { unmount } = render(<App options={SingleComponentSchema} />);

    // simple component will render 2 times, because it have to eval trait and properties twice
    expect(screen.getByTestId('single')?.textContent).toEqual(SingleComponentRenderTimes);
    expect(screen.getByTestId('single-destroy')?.textContent).toEqual('0');
    unmount();
    clear();
  });
});

describe('after the schema changes', () => {
  it('the component and its siblings will not unmount after schema changes', () => {
    const { App } = initSunmaoUI();
    const { rerender, unmount } = render(<App options={ComponentSchemaChangeSchema} />);
    expect(screen.getByTestId('staticComponent-destroy')?.textContent).toEqual('0');
    expect(screen.getByTestId('dynamicComponent-destroy')?.textContent).toEqual('0');

    const newMockSchema = produce(ComponentSchemaChangeSchema, draft => {
      const c = draft.spec.components.find(c => c.id === 'dynamicComponent');
      if (c) {
        c.properties.text = 'baz';
      }
    });
    rerender(<App options={newMockSchema} />);

    expect(screen.getByTestId('staticComponent-destroy')?.textContent).toEqual('0');
    expect(screen.getByTestId('dynamicComponent-destroy')?.textContent).toEqual('0');
    unmount();
    clear();
  });
});

describe('hidden trait condition', () => {
  it('the hidden component should not merge state in store', () => {
    const { App, stateManager } = initSunmaoUI();
    stateManager.noConsoleError = true;
    const { unmount } = render(<App options={HiddenTraitSchema} />);
    expect(screen.getByTestId('tester')?.textContent).toEqual(SingleComponentRenderTimes);
    expect(screen.getByTestId('tester-text')?.textContent).toEqual('');
    expect(stateManager.store['input1']).toBeUndefined();

    unmount();
    clear();
  });
});

describe('when component merge state synchronously', () => {
  it('it will not cause extra render', () => {
    const { App, stateManager } = initSunmaoUI();
    const { unmount } = render(<App options={MergeStateSchema} />);
    expect(screen.getByTestId('tester')?.textContent).toEqual(SingleComponentRenderTimes);
    expect(screen.getByTestId('tester-text')?.textContent).toEqual('foo-bar-baz');
    expect(stateManager.store['input'].value).toBe('foo');

    unmount();
    clear();
  });

  it(`the components' order will not cause extra render`, () => {
    const newMergeStateSchema = produce(MergeStateSchema, draft => {
      const temp = draft.spec.components[0];
      draft.spec.components[0] = draft.spec.components[1];
      draft.spec.components[1] = temp;
    });
    const { App, stateManager } = initSunmaoUI();
    const { unmount } = render(<App options={newMergeStateSchema} />);
    expect(screen.getByTestId('tester')?.textContent).toEqual(SingleComponentRenderTimes);
    expect(screen.getByTestId('tester-text')?.textContent).toEqual('foo-bar-baz');
    expect(stateManager.store['input'].value).toBe('foo');

    unmount();
    clear();
  });
});
// expect(screen.getByTestId('tester1-text')?.textContent).toEqual('0');

// expect(screen.getByTestId('tester1')?.textContent).toEqual('3');
// expect(screen.getByTestId('tester2')?.textContent).toEqual('2');
// expect(screen.getByTestId('tester1-text')?.textContent).toEqual('1');

// rerender(<App options={newMockSchema} />);

// expect(screen.getByTestId('tester1')?.textContent).toEqual('3');
// expect(screen.getByTestId('tester2')?.textContent).toEqual('3');
// expect(screen.getByTestId('tester1-text')?.textContent).toEqual('1');

// waitFor(() => {
// });

// // the queries can accept a regex to make your selectors more resilient to content tweaks and changes.
// fireEvent.click(screen.getByLabelText(/show/i));

// // .toBeInTheDocument() is an assertion that comes from jest-dom
// // otherwise you could use .toBeDefined()
// expect(screen.getByText(testMessage)).toBeInTheDocument();
