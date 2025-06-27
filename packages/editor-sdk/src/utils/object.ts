function stringify(obj: unknown) {
  if (typeof obj !== 'object' && typeof obj !== 'function') {
    return String(obj);
  }

  const cache: unknown[] = [];

  JSON.stringify(
    obj,
    (_, value) => {
      if (typeof value === 'object' && value !== null) {
        // Duplicate reference found, discard key
        if (cache.includes(value)) return;

        // Store value in our collection
        cache.push(value);
      }

      return value;
    },
    2
  );
}

export { stringify };
