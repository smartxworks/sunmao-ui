import { Key, pathToRegexp } from 'path-to-regexp';
import { Match, PatternToRegexpResult as WouterPTR } from 'wouter';
import { RouteProps } from './component';

export type MatcherFn = (
  location: string | undefined,
  prop: RouteProps
) => Match;
export type PatternToRegexpResult = {
  ''?: WouterPTR;
  exact?: WouterPTR;
  strict?: WouterPTR;
  sensitive?: WouterPTR;
  exactstrict?: WouterPTR;
  exactsensitive?: WouterPTR;
  strictsensitive?: WouterPTR;
  exactstrictsensitive?: WouterPTR;
};
export function makeMatcher(): MatcherFn {
  const cache: Record<string, PatternToRegexpResult> = {};
  const makeRegexpFn: (
    pattern: string,
    exact: boolean,
    strict: boolean,
    sensitive: boolean
  ) => WouterPTR = (path, exact, strict, sensitive) => {
    const keys: Key[] = [];

    const regexp = pathToRegexp(path, keys, { strict, end: exact, sensitive });
    return { keys, regexp };
  };
  // obtains a cached regexp version of the pattern
  const getRegexp = (
    pattern: string,
    exact: boolean,
    strict: boolean,
    sensitive: boolean
  ): WouterPTR => {
    const key = `${exact ? 'exact' : ''}${strict ? 'strict' : ''}${
      sensitive ? 'sensitive' : ''
    }` as keyof PatternToRegexpResult;
    if (!cache[pattern]) {
      cache[pattern] = {};
    }
    return (
      cache[pattern][key] ||
      (cache[pattern][key] = makeRegexpFn(pattern, exact, strict, sensitive))
    );
  };

  return (location, { path, strict, exact, sensitive }) => {
    const { regexp, keys } = getRegexp(
      path || '',
      exact || true,
      strict || true,
      sensitive || false
    );
    // regexp.exec(undefined) = null, use regexp.exec(path||'') may cause defect;
    const out = regexp.exec(location!);

    if (!out) return [false, null];

    // formats an object with matched params
    const params = keys.reduce<Record<string | number, any>>(
      (params, key, i) => {
        params[key.name] = out[i + 1];
        return params;
      },
      {}
    );

    return [true, params];
  };
}
