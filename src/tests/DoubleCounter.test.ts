import DoubleCounter from '$app/components/DoubleCounter.svelte';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest';

it('Autotracking class with two tracked fields', async () => {
  render(DoubleCounter);

  const updateCount = await screen.findByTestId('updateCount');
  expect(updateCount).toHaveTextContent('1');

  const count = await screen.findByTestId('count');
  const count2 = await screen.findByTestId('count2');
  expect(count).toHaveTextContent('0');
  expect(count2).toHaveTextContent('0');
  const incrementBoth = await screen.findByTestId('incrementBoth');
  await userEvent.click(incrementBoth);
  expect(count).toHaveTextContent('1');
  expect(count2).toHaveTextContent('1');
  expect(updateCount).toHaveTextContent('2');

});
