import React, {
  useEffect,
  useMemo,
  createElement,
  useState,
  useRef,
} from "react";
import { createComponent } from "@meta-ui/core";
import { Static, Type } from "@sinclair/typebox";
import { ComponentImplementation } from "../../registry";
import {
  Redirect,
  Router as Wouter,
  Route as Woute,
  Switch,
  useLocation,
  useRouter,
} from "wouter";
import makeCachedMatcher from "wouter/matcher";
import { Key, pathToRegexp } from "path-to-regexp";

const currentLocation = () => {
  return window.location.hash.replace(/^#/, "") || "/";
};

const navigate = (to: string) => (window.location.hash = to);

// if history api is not supported, graceful downgrade to use hash instead
const useHashLocation = (): [string, (str: string) => string] => {
  const [loc, setLoc] = useState(currentLocation());

  useEffect(() => {
    const handler = () => setLoc(currentLocation());
    // subscribe to hash changes
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return [loc, navigate];
};

// use pathToRegexp library as matcher
const matcher = makeCachedMatcher((path: string) => {
  let keys: Key[] = [];

  const regexp = pathToRegexp(path, keys, { strict: true });
  return { keys, regexp };
});

export const RouterProvider: React.FC<{ useRouter: boolean }> = ({
  useRouter,
  children,
}) => {
  // TODO: use history api here;
  const hook =
    //useRef(useHashLocation);
    useRef(window.history ? undefined : useHashLocation);
  const base = useRef(location.pathname);
  return useRouter ? (
    <Wouter base={base.current} hook={hook.current} matcher={matcher}>
      {children}
    </Wouter>
  ) : (
    <>{children}</>
  );
};

const Router: ComponentImplementation<{
  routerPolicy: Static<typeof RouterPolicyPropertySchema>;
}> = ({ routerMap, routerPolicy, subscribeMethods }) => {
  const [parentPath, naviagte] = useLocation();

  const routes = useMemo(() => {
    let defaultPath: string | undefined = undefined;
    const result = routerPolicy.map(
      ({ type, path, cid, href, default: _default }) => {
        const C = routerMap && routerMap.get(cid);
        if (defaultPath === undefined && _default) {
          defaultPath = path;
        }
        switch (type.toUpperCase()) {
          case RouteType.REDIRECT:
            return (
              <Woute path={path}>
                <Redirect href={href || path} />
              </Woute>
            );
          case RouteType.ROUTE:
            if (!C) {
              console.warn("component not registered to router");
              return <></>;
            }
            if (C.displayName === "router") {
              return (
                <Woute path={path}>
                  <Wouter base={`${parentPath}/${path}`}>
                    <C key={cid}></C>
                  </Wouter>
                </Woute>
              );
            }
            return (
              <Woute path={path}>
                <C key={cid}></C>
              </Woute>
            );
          default:
            console.warn("unsupport router type");
            return <></>;
        }
      }
    );
    if (defaultPath) {
      result.push(
        <Woute>
          <Redirect href={defaultPath} />
        </Woute>
      );
    }
    return result;
  }, []);
  useEffect(() => {
    subscribeMethods({
      navigate: (path: string) => {
        naviagte(path);
      },
    });
  }, []);
  return <Switch children={routes}></Switch>;
};

enum RouteType {
  REDIRECT = "REDIRECT",
  ROUTE = "ROUTE",
}

const RouterPolicyPropertySchema = Type.Array(
  Type.Object({
    type: Type.Enum(RouteType), // redirect, route
    default: Type.Boolean(), //only the first one with default will be treated as default component;
    path: Type.String(),
    cid: Type.String(),
    href: Type.Optional(Type.String()), // work for redirect
  })
);

export default {
  ...createComponent({
    version: "core/v1",
    metadata: {
      name: "router",
      description: "create a router-controlled component",
    },
    spec: {
      properties: [
        {
          name: "routerPolicy",
          ...RouterPolicyPropertySchema,
        },
      ],
      acceptTraits: [],
      state: {},
      methods: [],
    },
  }),
  impl: Router,
};
