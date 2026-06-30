// ===== CLOSURE + MEMOIZACIÓN =====
// memoize() recibe una función y devuelve OTRA función que "recuerda"
// resultados ya calculados. El objeto 'cache' vive dentro del closure:
// la función retornada sigue teniendo acceso a 'cache' aunque memoize()
// ya haya terminado de ejecutarse. Eso es un closure.

export function memoize<A extends unknown[], R>(
  fn: (...args: A) => R
): (...args: A) => R {
  const cache = new Map<string, R>(); // <-- vive "atrapada" en el closure

  return (...args: A): R => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`(memo) usando resultado en caché para ${key}`);
      return cache.get(key) as R;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}