let listeners = [];

export function subscribeFlash(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

export function flash(message, variant = "info") {
  for (const fn of listeners) fn({ message, variant, id: crypto.randomUUID() });
}
