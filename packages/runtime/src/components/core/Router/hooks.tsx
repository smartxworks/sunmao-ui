import {
  useState,
  useCallback,
  useEffect,
  useRef,
  createContext,
  useContext,
} from 'react';
import useWouterLocation, { LocationHook } from 'wouter/use-location';

// hash location and hash hook
const currentLocation = (base: string, hash = location.hash) => {
  hash = window.location.hash.replace(/^#/, '');
  return !hash.toLowerCase().indexOf(hash)
    ? hash.slice(base.length) || '/'
    : '~' + hash;
};

// if history api is not supported, graceful downgrade to use hash instead
const useHashLocation = ({ base = '' } = {}): [
  string,
  (str: string) => void
] => {
  const [loc, setLoc] = useState(currentLocation(base));
  const navigate = useCallback(
    (to: string) => {
      window.location.hash = base + to;
    },
    [base]
  );

  useEffect(() => {
    const handler = () => setLoc(currentLocation(base));
    // subscribe to hash changes
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return [loc, navigate];
};

export type RouterContext = {
  hook: LocationHook;
  base: string;
};

export const RouterCtx = createContext<{
  v?: RouterContext;
}>({});

// build router context by base
export const buildRouter = ({
  hook = window.history ? useWouterLocation : useHashLocation,
  base = window.history ? location.pathname : location.hash,
} = {}): RouterContext => ({
  hook,
  base,
});

export const useRouter = () => {
  const globalRef = useContext(RouterCtx);

  return globalRef.v || (globalRef.v = buildRouter());
};

export const useLocation = () => {
  const router = useRouter();
  return router.hook(router);
};

export const useNavigate = (options: {
  to?: string;
  href?: string;
  replace?: boolean;
}) => {
  const navRef = useRef<() => void>();
  const [, navigate] = useLocation();
  const to = options.to || options.href;
  if (!to && to !== '') {
    console.error('undefined path');
  }
  navRef.current = () => navigate(to || '', options);
  return navRef;
};
