// ===== CLOSURE + MEMOIZACIÓN =====
// memoize() recibe una función y devuelve OTRA función que "recuerda"
// resultados ya calculados. El objeto 'cache' vive dentro del closure.

export function memoize(fn: Function) {
  const cache = new Map<string, any>();

  return (...args: any[]) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}