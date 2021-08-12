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
  const routes = useMemo(() => {
    const defaultEle: {
      ele?: React.FC;
      path?: string;
    } = {};
    const result = routerPolicy.map(
      ({ type, path, cid, href, default: _default }) => {
        const C = routerMap && routerMap.get(cid);
        if (!C) {
          console.warn("component not registered to router");
          return <></>;
        }
        if (!defaultEle.ele && _default) {
          defaultEle.ele = C;
          defaultEle.path = path;
        }
        switch (type.toUpperCase()) {
          case RouteType.REDIRECT:
            return <Redirect href={href || path} key={cid}></Redirect>;
          case RouteType.ROUTE:
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
    // if (defaultEle.ele) {
    //   const C = defaultEle.ele as React.FC;
    //   result.push(
    //     <Redirect href={defaultEle.path}>
    //       <C></C>
    //     </Redirect>
    //   );
    // }
    return result;
  }, []);
  const [, navigate] = useLocation();
  useEffect(() => {
    subscribeMethods({
      navigate: (path: string) => {
        navigate(path);
      },
    });
  }, []);
  return <Switch children={routes}></Switch>;
};

enum RouteType {
  REDIRECT = "REDIRECT",
  ROUTE = "ROUTE",
}

const IdPropertySchema = Type.String();
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
