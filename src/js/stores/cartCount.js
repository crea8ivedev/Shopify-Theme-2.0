import { writable } from 'svelte/store';

function createCount() {
  const { subscribe, set, update } = writable(0);

  return {
    subscribe,
    set,
    update,
    increment: (qty = 1) => {
      update((count) => count + qty);
    },
    decrement: (qty = 1) => {
      update((count) => count - qty);
    },
    empty: () => {
      set(0);
    },
  };
}

export default createCount();
