/* eslint-disable no-undef */
import '@testing-library/jest-dom';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { initSunmaoUI } from '../../src';
import { MockSchema } from './mockSchema.spec';

const { App } = initSunmaoUI();

test('shows the children when the checkbox is checked', () => {
  render(<App options={MockSchema} />);

  expect(screen.getByTestId('tester1')?.textContent).toEqual('2');
  expect(screen.getByTestId('tester1-text')?.textContent).toEqual('0');
  fireEvent.click(screen.getByTestId('button1'));

  expect(screen.getByTestId('tester1')?.textContent).toEqual('3');
  expect(screen.getByTestId('tester1-text')?.textContent).toEqual('1');
  // waitFor(() => {
  // });

  // // the queries can accept a regex to make your selectors more resilient to content tweaks and changes.
  // fireEvent.click(screen.getByLabelText(/show/i));

  // // .toBeInTheDocument() is an assertion that comes from jest-dom
  // // otherwise you could use .toBeDefined()
  // expect(screen.getByText(testMessage)).toBeInTheDocument();
});
