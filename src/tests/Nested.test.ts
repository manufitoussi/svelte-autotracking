import Nested from '$app/components/Nested.svelte';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';

it('Autotracking class with nested', async () => {
  render(Nested);

  const updateCount = await screen.findByTestId('updateCount');
  expect(updateCount).toHaveTextContent('1');

  const count = await screen.findByTestId('count');
  expect(count).toHaveTextContent('0');
  const increment = await screen.findByTestId('increment');
  await userEvent.click(increment);
  expect(count).toHaveTextContent('1');
  expect(updateCount).toHaveTextContent('2');

});
