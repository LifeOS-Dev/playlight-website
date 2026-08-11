/** Shared channel so any button on the page can open the one download panel. */
export const GET_PLAYLIGHT_EVENT = "pl3:get-playlight";

let lastTrigger: HTMLElement | null = null;

/**
 * Remembers which control asked, so focus can be handed back on close.
 * Captured here rather than read from `document.activeElement` in the
 * listener, which is not reliably still the button by then.
 */
export function openGetPlaylight(trigger?: HTMLElement | null) {
  lastTrigger = trigger ?? (document.activeElement as HTMLElement | null);
  window.dispatchEvent(new Event(GET_PLAYLIGHT_EVENT));
}

export function consumeTrigger() {
  const node = lastTrigger;
  lastTrigger = null;
  return node;
}
