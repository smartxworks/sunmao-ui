import {
  cloneElement,
  Fragment,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  useMemo,
  useEffect,
  useRef,
  createElement,
  useLayoutEffect,
} from 'react';
import { DefaultParams, Match } from 'wouter';
import { RouteType, SwitchPolicy } from '.';
import { makeMatcher } from './matcher';
import {
  useRouter,
  useLocation,
  buildRouter,
  RouterContext,
  RouterCtx,
  useNavigate,
} from './hooks';
import { SlotsMap } from '../../../types/RuntimeSchema';

export type RouteLikeElement = PropsWithChildren<{
  path?: string;
  exact?: boolean;
  strict?: boolean;
  sensitive?: boolean;
  match?: [boolean, any];
}>;

export type RouteProps = RouteLikeElement & {
  mergeState: (params: any) => void;
};

export const Route: React.FC<RouteProps> = ({ match, children, mergeState }) => {
  const [matches, params] = match || [false, null];
  useEffect(() => {
    // if match router, merge the parameter of the route
    matches && mergeState(params);
    return () => {
      if (!matches) {
        return;
      }
      // if match router, clean it when component get destroyed
      const destroyObj: Record<string, undefined> = {};
      for (const key in params) {
        destroyObj[key] = undefined;
      }
      mergeState(destroyObj);
    };
  }, [params]);
  if (!matches) return null;
  return typeof children === 'function' ? children(params) : children;
};

type SwitchProps = {
  location?: string;
  switchPolicy: SwitchPolicy;
  slotMap?: SlotsMap<string>;
  mergeState: (partialState: any) => void;
  subscribeMethods: (map: { [key: string]: (parameters: any) => void }) => void;
};

export const Switch: React.FC<SwitchProps> = ({
  switchPolicy,
  location,
  slotMap,
  mergeState,
  subscribeMethods,
}) => {
  const [originalLocation] = useLocation();
  const matcher = useMemo(() => makeMatcher(), []);

  const [loc, naviagte] = useLocation();

  const routes = useMemo(() => {
    let defaultPath: string | undefined = undefined;
    const result = switchPolicy.map(
      ({ type, path, slotId, href, default: _default, exact, strict, sensitive }) => {
        const componentsArr = slotMap && slotMap.get(slotId);
        if (defaultPath === undefined && _default) {
          defaultPath = path;
        }
        switch (type.toUpperCase()) {
          case RouteType.REDIRECT:
            return (
              <Route
                key={path}
                exact={exact}
                strict={strict}
                sensitive={sensitive}
                path={path}
                mergeState={mergeState}
              >
                <Redirect href={href || path} />
              </Route>
            );
          case RouteType.ROUTE:
            if (!componentsArr) {
              console.warn('component not registered to router');
              return <></>;
            }
            if (componentsArr.length !== 1) {
              console.warn('router slot can only have one component');
            }
            const { component: C } = componentsArr[0];
            if (C.displayName === 'router') {
              return (
                // it should match both itself and its children path
                <Nested path={`(${path}|${path}/.*)`} base={path} key={path}>
                  <C key={slotId}></C>
                </Nested>
              );
            }
            return (
              <Route
                exact={exact}
                strict={strict}
                sensitive={sensitive}
                key={path}
                path={path}
                mergeState={mergeState}
              >
                <C key={slotId}></C>
              </Route>
            );
          default:
            console.warn('unsupport router type');
            return <></>;
        }
      }
    );
    if (defaultPath) {
      result.push(
        <Route mergeState={mergeState}>
          <Redirect href={defaultPath} />
        </Route>
      );
    }
    return result;
  }, [switchPolicy]);

  useEffect(() => {
    subscribeMethods({
      navigate: (path: string) => {
        naviagte(path);
      },
    });
  }, []);

  useEffect(() => {
    // to assign location as a state
    mergeState({
      route: loc,
    });
    () => {
      mergeState({
        route: undefined,
      });
    };
  }, [loc]);

  for (const element of flattenChildren(routes)) {
    const match: Match<DefaultParams> = element.props.path
      ? matcher(location || originalLocation, element.props)
      : [true, {}];

    if (isValidElement(element) && match[0]) return cloneElement(element, { match });
  }

  return null;
};

type NestedProps = RouteLikeElement & { base: string };

// all route-like component must have path property, wouter use path to determined if a component match the route
// but we need path to match both nested router itself and its child route, so we need to have an alternative property called base as the real path of the nested router
// and used by its children
export const Nested: React.FC<NestedProps> = ({ children, base }) => {
  const router = useRouter();
  const [parentLocation] = useLocation();

  const nestedBase = `${router.base}${base}`;

  // don't render anything outside of the scope
  if (!parentLocation.startsWith(base)) {
    return null;
  }

  // we need key to make sure the router will remount if the base changes
  return (
    <Wouter base={nestedBase} key={nestedBase}>
      {children}
    </Wouter>
  );
};

type WouterProps = {
  base: string;
};

export const Wouter = (props: React.PropsWithChildren<WouterProps>) => {
  const ref = useRef<{ v?: RouterContext }>();

  const value = ref.current || (ref.current = { v: buildRouter(props) });

  return createElement(
    RouterCtx.Provider,
    {
      value,
    },
    props.children
  );
};

type RedirectProps = {
  to?: string;
  href?: string;
  replace?: boolean;
};

export const Redirect: React.FC<RedirectProps> = props => {
  const navRef = useNavigate(props);

  // empty array means running the effect once, navRef is a ref so it never changes
  useLayoutEffect(() => {
    navRef.current!();
  }, []);

  return null;
};

const flattenChildren = (
  children: Array<ReactElement<RouteProps>> | ReactElement<RouteProps> | undefined
): ReactElement<RouteProps>[] => {
  if (!children) {
    return [];
  }
  return Array.isArray(children)
    ? ([] as ReactElement<RouteProps>[]).concat(
        ...children.map(c =>
          c.type === Fragment
            ? flattenChildren(c.props.children as ReactElement<RouteProps>)
            : flattenChildren(c)
        )
      )
    : [children];
};
