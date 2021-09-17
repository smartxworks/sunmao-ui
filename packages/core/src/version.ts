const VERSION_REG = /^([a-zA-Z0-9_\d]+)\/([a-zA-Z0-9_\d]+)$/;

export function isValidVersion(v: string): boolean {
  return VERSION_REG.test(v);
}

export type Version = {
  category: string;
  value: string;
};

export function parseVersion(v: string): Version {
  if (!isValidVersion(v)) {
    throw new Error(`Invalid version string: "${v}"`);
  }

  const [, category, value] = v.match(VERSION_REG) || [];
  return {
    category,
    value,
  };
}
