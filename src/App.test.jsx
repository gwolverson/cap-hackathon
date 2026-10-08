import React from 'react';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from './App.jsx';

const smash = 'The classic smash';
const pizza = 'A little slice of Italy';
const bowl = 'The feel-good bowl';
const sushi = 'Roll with it';
const chicken = 'The crispy chicken';
const cookies = 'A sweet landing';
const allMeals = [smash, pizza, bowl, sushi, chicken, cookies];
const completionAlt = 'A drone delivering a food order to a customer at their doorstep';

function setup({ timed = false } = {}) {
  if (timed) {
    vi.useFakeTimers();
    // Testing Library detects fake timers through Jest's timer API.
    // Bridge that API to Vitest so its async event wrapper can drain timers.
    vi.stubGlobal('jest', { advanceTimersByTime: vi.advanceTimersByTime });
  }
  const user = userEvent.setup(timed ? { advanceTimers: vi.advanceTimersByTime } : {});
  const view = render(<App/>);
  return { user, ...view };
}

const visibleMeals = () => screen.queryAllByRole('heading', { level: 3 }).map(el => el.textContent);
const addMeal = (user, name = smash) => user.click(screen.getByRole('button', { name: `Add ${name} to bag` }));
const dialog = () => within(screen.getByRole('dialog'));
const closeDialog = user => user.click(dialog().getByRole('button', { name: 'Close dialog' }));

async function openBag(user) {
  await user.click(screen.getByRole('button', { name: /^My bag \d+$/ }));
  return dialog();
}

async function placeOrder(user, { meal = smash, delivery = 'drone' } = {}) {
  await addMeal(user, meal);
  const bag = await openBag(user);
  if (delivery === 'standard') {
    await user.click(bag.getByRole('button', { name: /Standard delivery/ }));
  }
  await user.click(bag.getByRole('button', { name: 'Place demo order' }));
  return dialog();
}

function advanceTracking(steps = 1) {
  // Flush each render so its effect schedules the next tracking timeout.
  for (let step = 0; step < steps; step++) {
    act(() => vi.advanceTimersByTime(8000));
  }
}

function expectTotal(bag, label, amount) {
  expect(bag.getByText(label, { exact: true }).parentElement).toHaveTextContent(amount);
}

describe('Menu discovery', () => {
  it('shows all six meals initially', () => {
    setup();
    expect(visibleMeals()).toEqual(allMeals);
    expect(screen.getByRole('button', { name: /All meals/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it.each([
    ['Burgers', [smash, chicken]],
    ['Pizza', [pizza]],
    ['Bowls', [bowl]],
    ['Sushi', [sushi]],
    ['Desserts', [cookies]],
  ])('filters the %s category and restores all meals', async (category, expected) => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: new RegExp(category) }));
    expect(visibleMeals()).toEqual(expected);
    await user.click(screen.getByRole('button', { name: /All meals/ }));
    expect(visibleMeals()).toEqual(allMeals);
  });

  it.each([
    ['CLASSIC SMASH', [smash]],
    ['bun & beyond', [smash, chicken]],
    ['sushi', [sushi]],
    ['chipotle', [chicken]],
  ])('searches meal, restaurant, category and description text: %s', async (query, expected) => {
    const { user } = setup();
    await user.type(screen.getByRole('textbox', { name: 'Search meals or restaurants' }), query);
    expect(visibleMeals()).toEqual(expected);
  });

  it('combines search, category and favorites filters', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: `Save ${smash}` }));
    await user.click(screen.getByRole('button', { name: /Burgers/ }));
    await user.type(screen.getByRole('textbox', { name: 'Search meals or restaurants' }), 'Bun & Beyond');
    await user.click(screen.getByRole('button', { name: 'Show favorite meals' }));
    expect(visibleMeals()).toEqual([smash]);
  });

  it('shows an empty search result and restores meals when search is cleared', async () => {
    const { user } = setup();
    await user.type(screen.getByRole('textbox', { name: 'Search meals or restaurants' }), 'unavailable meal');
    expect(screen.getByRole('heading', { name: 'No bites found' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: `Add ${smash} to bag` })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(visibleMeals()).toEqual(allMeals);
  });

  it('resets search, category and favorites when Explore is selected', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /Pizza/ }));
    await user.type(screen.getByRole('textbox', { name: 'Search meals or restaurants' }), 'Italy');
    await user.click(screen.getByRole('button', { name: 'Show favorite meals' }));
    await user.click(screen.getByRole('button', { name: 'Explore', exact: true }));
    expect(visibleMeals()).toEqual(allMeals);
    expect(screen.getByRole('textbox', { name: 'Search meals or restaurants' })).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Show favorite meals' })).toHaveAttribute('aria-pressed', 'false');
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });
});

describe('Favorites', () => {
  it('saves and unsaves a meal while the favorites filter is active', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: `Save ${smash}` }));
    expect(screen.getByRole('button', { name: `Unsave ${smash}` })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Show favorite meals' }));
    expect(visibleMeals()).toEqual([smash]);
    await user.click(screen.getByRole('button', { name: `Unsave ${smash}` }));
    expect(screen.getByRole('heading', { name: 'No favorites here yet' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Explore all meals' }));
    expect(visibleMeals()).toEqual(allMeals);
    expect(screen.getByRole('button', { name: `Save ${smash}` })).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('Cart and delivery', () => {
  it('does not offer checkout for an empty bag', async () => {
    const { user } = setup();
    const bag = await openBag(user);
    expect(bag.getByRole('heading', { name: 'Your bag is waiting for a good bite.' })).toBeInTheDocument();
    expect(bag.queryByRole('button', { name: 'Place demo order' })).not.toBeInTheDocument();
  });

  it('keeps quantities synchronized between meal cards and the bag', async () => {
    const { user } = setup();
    await addMeal(user);
    await user.click(screen.getByRole('button', { name: `Add one ${smash}` }));
    expect(screen.getByRole('button', { name: 'My bag 2' })).toBeInTheDocument();
    const bag = await openBag(user);
    expectTotal(bag, 'Subtotal', '£25.00');
    await user.click(bag.getByRole('button', { name: `Remove one ${smash}` }));
    expectTotal(bag, 'Subtotal', '£12.50');
    await closeDialog(user);
    expect(screen.getByRole('button', { name: 'My bag 1' })).toBeInTheDocument();
    const card = screen.getByRole('heading', { name: smash }).closest('article');
    expect(within(card).getByText('1', { exact: true })).toBeInTheDocument();
  });

  it('removes the final item and returns to an empty bag', async () => {
    const { user } = setup();
    await addMeal(user);
    const bag = await openBag(user);
    await user.click(bag.getByRole('button', { name: `Remove one ${smash}` }));
    expect(bag.getByRole('heading', { name: 'Your bag is waiting for a good bite.' })).toBeInTheDocument();
    await closeDialog(user);
    expect(screen.getByRole('button', { name: 'My bag 0' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: `Add ${smash} to bag` })).toBeInTheDocument();
  });

  it('calculates mixed-meal totals and changes the fee with the delivery method', async () => {
    const { user } = setup();
    await addMeal(user);
    await user.click(screen.getByRole('button', { name: `Add one ${smash}` }));
    await addMeal(user, pizza);
    expect(screen.getByRole('button', { name: 'My bag 3' })).toBeInTheDocument();
    const bag = await openBag(user);
    expectTotal(bag, 'Subtotal', '£39.00');
    expectTotal(bag, 'Delivery', '£3.99');
    expectTotal(bag, 'Total', '£42.99');
    expect(bag.getByRole('button', { name: /Express drone/ })).toHaveAttribute('aria-pressed', 'true');
    await user.click(bag.getByRole('button', { name: /Standard delivery/ }));
    expectTotal(bag, 'Delivery', '£1.99');
    expectTotal(bag, 'Total', '£40.99');
    expect(bag.getByRole('button', { name: /Standard delivery/ })).toHaveAttribute('aria-pressed', 'true');
    expect(bag.getByRole('button', { name: /Express drone/ })).toHaveAttribute('aria-pressed', 'false');
    await user.click(bag.getByRole('button', { name: /Express drone/ }));
    expectTotal(bag, 'Total', '£42.99');
  });

  it('shows an add-to-bag notification and dismisses it after 2.4 seconds', async () => {
    const { user } = setup({ timed: true });
    await addMeal(user);
    expect(screen.getByRole('status')).toHaveTextContent(`${smash} added to your bag`);
    act(() => vi.advanceTimersByTime(2399));
    expect(screen.getByRole('status')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('Delivery address', () => {
  it('saves a trimmed address and uses it at checkout', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Deliver to 24, Maple Street' }));
    const form = dialog();
    await user.clear(form.getByRole('textbox', { name: 'Delivery address' }));
    await user.type(form.getByRole('textbox', { name: 'Delivery address' }), '  10 Test Lane  ');
    await user.click(form.getByRole('button', { name: 'Save address' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Deliver to 10 Test Lane' })).toBeInTheDocument();
    await addMeal(user);
    const bag = await openBag(user);
    expect(bag.getByText('10 Test Lane')).toBeInTheDocument();
  });

  it('discards an unsaved address when the dialog is closed', async () => {
    const { user } = setup();
    const addressButton = screen.getByRole('button', { name: 'Deliver to 24, Maple Street' });
    await user.click(addressButton);
    await user.clear(dialog().getByRole('textbox', { name: 'Delivery address' }));
    await user.type(dialog().getByRole('textbox', { name: 'Delivery address' }), 'Unsaved address');
    await closeDialog(user);
    await user.click(addressButton);
    expect(dialog().getByRole('textbox', { name: 'Delivery address' })).toHaveValue('24, Maple Street');
  });

  it('rejects a whitespace-only address', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Deliver to 24, Maple Street' }));
    await user.clear(dialog().getByRole('textbox', { name: 'Delivery address' }));
    await user.type(dialog().getByRole('textbox', { name: 'Delivery address' }), '   ');
    await user.click(dialog().getByRole('button', { name: 'Save address' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await closeDialog(user);
    expect(screen.getByRole('button', { name: 'Deliver to 24, Maple Street' })).toBeInTheDocument();
  });
});

describe('Orders and simulated tracking', () => {
  it('shows an empty order history before checkout', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'My orders' }));
    expect(dialog().getByText(/You haven’t placed an order yet/)).toBeInTheDocument();
    expect(dialog().queryByRole('img', { name: completionAlt })).not.toBeInTheDocument();
  });

  it.each(['drone', 'standard'])('creates a %s order, clears the bag and completes tracking with the GIF', async delivery => {
    const { user } = setup({ timed: true });
    const tracking = await placeOrder(user, { delivery });
    expect(tracking.getByText(/AB-\d{5}/)).toBeInTheDocument();
    expect(tracking.getByText(`1 × ${smash}`)).toBeInTheDocument();
    expectTotal(tracking, 'Total, including delivery', delivery === 'drone' ? '£16.49' : '£14.49');
    expect(screen.getByRole('button', { name: 'My bag 0' })).toBeInTheDocument();
    expect(tracking.getByRole('heading', { name: 'A good bite is on its way.' })).toBeInTheDocument();
    expect(tracking.queryByRole('img', { name: completionAlt })).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(7999));
    expect(tracking.getByRole('heading', { name: 'A good bite is on its way.' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(tracking.getByRole('heading', { name: 'Fresh from the kitchen.' })).toBeInTheDocument();
    advanceTracking();
    expect(tracking.getByRole('heading', { name: 'Your food is on the move.' })).toBeInTheDocument();
    expect(tracking.getByText(delivery === 'drone' ? 'Drone in flight' : 'Courier on the way')).toBeInTheDocument();
    expect(tracking.queryByRole('img', { name: completionAlt })).not.toBeInTheDocument();
    advanceTracking();
    expect(tracking.getByRole('heading', { name: 'A delicious landing.' })).toBeInTheDocument();
    expect(tracking.getByRole('img', { name: completionAlt })).toHaveAttribute('src', expect.stringMatching(/drone-delivery.*\.gif/));
    expect(vi.getTimerCount()).toBe(0);
    advanceTracking();
    expect(tracking.getByRole('heading', { name: 'A delicious landing.' })).toBeInTheDocument();
  });

  it('continues tracking while the dialog is closed', async () => {
    const { user } = setup({ timed: true });
    await placeOrder(user);
    await closeDialog(user);
    advanceTracking(3);
    await user.click(screen.getByRole('button', { name: 'My orders' }));
    expect(dialog().getByRole('img', { name: completionAlt })).toBeInTheDocument();
  });

  it('keeps the placed order snapshot when the address and cart change', async () => {
    const { user } = setup({ timed: true });
    await placeOrder(user);
    await closeDialog(user);
    await user.click(screen.getByRole('button', { name: 'Deliver to 24, Maple Street' }));
    await user.clear(dialog().getByRole('textbox', { name: 'Delivery address' }));
    await user.type(dialog().getByRole('textbox', { name: 'Delivery address' }), '10 Test Lane');
    await user.click(dialog().getByRole('button', { name: 'Save address' }));
    await addMeal(user, pizza);
    await user.click(screen.getByRole('button', { name: 'My orders' }));
    expect(dialog().getByText('Express drone delivery to 24, Maple Street')).toBeInTheDocument();
    expect(dialog().getByText(`1 × ${smash}`)).toBeInTheDocument();
    expect(dialog().queryByText(`1 × ${pizza}`)).not.toBeInTheDocument();
    expectTotal(dialog(), 'Total, including delivery', '£16.49');
  });

  it('replaces the latest order and restarts tracking for a new checkout', async () => {
    const { user } = setup({ timed: true });
    await placeOrder(user);
    advanceTracking(3);
    await closeDialog(user);
    const latest = await placeOrder(user, { meal: pizza, delivery: 'standard' });
    expect(latest.getByRole('heading', { name: 'A good bite is on its way.' })).toBeInTheDocument();
    expect(latest.getByText(`1 × ${pizza}`)).toBeInTheDocument();
    expect(latest.queryByText(`1 × ${smash}`)).not.toBeInTheDocument();
    expect(latest.queryByRole('img', { name: completionAlt })).not.toBeInTheDocument();
    expectTotal(latest, 'Total, including delivery', '£15.99');
    advanceTracking();
    expect(latest.getByRole('heading', { name: 'Fresh from the kitchen.' })).toBeInTheDocument();
  });

  it('clears active tracking and notification timers when the app unmounts', async () => {
    const { user, unmount } = setup({ timed: true });
    await placeOrder(user);
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    expect(document.body.style.overflow).toBe('');
  });
});

describe('Dialogs and navigation', () => {
  it('opens How it works, locks scrolling and restores focus after Escape', async () => {
    const { user } = setup();
    const trigger = screen.getByRole('button', { name: 'How it works' });
    await user.click(trigger);
    expect(dialog().getByRole('heading', { name: 'Good food, on the fly.' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    expect(dialog().getByRole('button', { name: 'Close dialog' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
    expect(trigger).toHaveFocus();
  });

  it('keeps keyboard focus within the dialog in both directions', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'How it works' }));
    const first = dialog().getByRole('button', { name: 'Close dialog' });
    const last = dialog().getByRole('button', { name: 'Let’s find something delicious' });
    expect(first).toHaveFocus();
    await user.tab({ shift: true });
    expect(last).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus();
  });

  it('returns to the menu from How it works', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'How it works' }));
    await user.click(dialog().getByRole('button', { name: 'Let’s find something delicious' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(visibleMeals()).toEqual(allMeals);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });
});
