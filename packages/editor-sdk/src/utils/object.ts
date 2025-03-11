function stringify(obj: unknown) {
  const cache: unknown[] = [];

  JSON.stringify(obj, (_, value) => {
    if (typeof value === 'object' && value !== null) {
      // Duplicate reference found, discard key
      if (cache.includes(value)) return;

      // Store value in our collection
      cache.push(value);
    }

    return value;
  });
}

export { stringify };
