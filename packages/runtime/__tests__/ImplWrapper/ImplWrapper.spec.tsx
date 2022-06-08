import '@testing-library/jest-dom';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import produce from 'immer';
import { times } from 'lodash';
import { initSunmaoUI } from '../../src';
import { SingleComponentSchema } from './mockSchema.spec';

describe('single component condition', () => {
  const { App } = initSunmaoUI();
  const { rerender } = render(<App options={SingleComponentSchema} />);
  it('only render one time', () => {
    // simple component will render 2 times, because it have to eval trait and propties twice
    expect(screen.getByTestId('single')?.textContent).toEqual('2');
    expect(screen.getByTestId('single-destroy')?.textContent).toEqual('0');
  });
});

// expect(screen.getByTestId('tester1-text')?.textContent).toEqual('0');

// fireEvent.click(screen.getByTestId('button1'));

// expect(screen.getByTestId('tester1')?.textContent).toEqual('3');
// expect(screen.getByTestId('tester2')?.textContent).toEqual('2');
// expect(screen.getByTestId('tester1-text')?.textContent).toEqual('1');

// const newMockSchema = produce(MockSchema, draft => {
//   const tester2 = draft.spec.components.find(c => c.id === 'tester2')
//   if (tester2) {
//     tester2.properties.text = 'foo'
//   }
// })

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
