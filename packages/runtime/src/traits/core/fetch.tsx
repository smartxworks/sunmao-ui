import { useCallback, useEffect, useMemo } from "react";
import { createTrait } from "@meta-ui/core";
import { Static, Type } from "@sinclair/typebox";
import { TraitImplementation } from "../../registry";
import { evalInContext, useExpression, useStore } from "../../store";

const useFetchTrait: TraitImplementation<FetchPropertySchema> = ({
  name,
  url,
  method,
  lazy: _lazy,
  headers: _headers,
  body,
  mergeState,
  subscribeMethods,
}) => {
  const lazy = useMemo(() => {
    return _lazy === undefined ? method.toLowerCase() !== "get" : _lazy;
  }, [method, _lazy]);

  const urlExpression = useExpression(url);

  const fetchData = useCallback(() => {
    // before fetching, initial data
    mergeState({
      [name]: {
        loading: true,
        data: undefined,
        error: undefined,
      },
    });
    // FIXME: listen to the header change
    const headers = new Headers();
    if (_headers) {
      for (let i = 0; i < _headers.length; i++) {
        const header = _headers[i];
        const value = evalInContext(_headers[i].value, useStore.getState());
        headers.append(header.key, value);
      }
    }
    // fetch data
    fetch(urlExpression, {
      method,
      headers,
      body,
    }).then(
      async (response) => {
        if (response.ok) {
          // handle 20x/30x
          const data = await response.json();
          mergeState({
            [name]: {
              loading: false,
              data,
              error: undefined,
            },
          });
        } else {
          // TODO: Add FetchError class and remove console info
          const error = new Error(
            `HTTP${response.status}: ${response.statusText}`
          );
          console.warn(error);
          mergeState({
            [name]: {
              loading: false,
              data: undefined,
              error,
            },
          });
        }
      },
      async (error) => {
        console.warn(error);
        mergeState({
          [name]: {
            loading: false,
            data: undefined,
            error: error instanceof Error ? error : new Error(error),
          },
        });
      }
    );
  }, [urlExpression, method, _headers, body, lazy]);

  // intialize data
  useEffect(() => {
    mergeState({
      [name]: {
        loading: false,
        data: undefined,
        error: undefined,
      },
    });
  }, []);

  // non lazy query, listen to the change and query;
  useEffect(() => {
    if (lazy || !urlExpression) {
      return;
    }
    fetchData();
  }, [urlExpression, method, _headers, body, lazy]);

  // only subscribe non lazy fetch trait
  if (lazy) {
    subscribeMethods({
      triggerFetch(key) {
        if (key === name) {
          fetchData();
        }
      },
    });
  }

  return {
    props: null,
  };
};

const NamePropertySchema = Type.String();
const UrlPropertySchema = Type.String(); // {format:uri}?;
const MethodPropertySchema = Type.String(); // {pattern: /^(get|post|put|delete)$/i}
const LazyPropertySchema = Type.Boolean();
const HeaderPropertySchema = Type.Array(
  Type.Object({ key: Type.String(), value: Type.String() })
);
const BodyPropertySchema = Type.Any(); // Type.String()?

type FetchPropertySchema = {
  name: Static<typeof NamePropertySchema>;
  url: Static<typeof UrlPropertySchema>;
  method: Static<typeof MethodPropertySchema>;
  lazy?: Static<typeof LazyPropertySchema>;
  headers?: Static<typeof HeaderPropertySchema>;
  body?: Static<typeof BodyPropertySchema>;
};

export default {
  ...createTrait({
    version: "core/v1",
    metadata: {
      name: "fetch",
      description: "fetch data to store",
    },
    spec: {
      properties: [
        {
          name: "name",
          ...NamePropertySchema,
        },
        {
          name: "url",
          ...UrlPropertySchema,
        },
        {
          name: "method",
          ...MethodPropertySchema,
        },
        {
          name: "lazy",
          ...LazyPropertySchema,
        },
        {
          name: "headers",
          ...HeaderPropertySchema,
        },
        {
          name: "body",
          ...BodyPropertySchema,
        },
      ],
      state: {},
      methods: [],
    },
  }),
  impl: useFetchTrait,
};
