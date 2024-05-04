import Named from '$app/components/Named.svelte';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest';

it('Autotracking class with only one tracked field', async () => {
  render(Named);

  const updateCount = await screen.findByTestId('updateCount');
  expect(updateCount).toHaveTextContent('1');

  const dd = await screen.findByTestId('name');
  expect(dd).toHaveTextContent('The name');
  const button = await screen.findByTestId('changeName');
  await userEvent.click(button);
  expect(dd).toHaveTextContent('hello');
  expect(updateCount).toHaveTextContent('2');

  const button2 = await screen.findByTestId('resetOtherName');
  const dd2 = await screen.findByTestId('otherName');
  expect(dd2).toHaveTextContent('The Counter other name');
  await userEvent.click(button2);
  expect(dd2).toHaveTextContent('The Counter other name has changed.');
  expect(updateCount).toHaveTextContent('3');

});
