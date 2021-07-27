import { useEffect, useMemo } from "react";
import { Static, Type } from "@sinclair/typebox";
import { createTrait } from "@meta-ui/core";
import { TraitImplementation } from "../../registry";
import { emitter, useExpression } from "../../store";
import { nanoid } from "nanoid";
const useFetchTrait: TraitImplementation<FetchTraitSchemaProperty> = ({
  url,
  name,
  method,
  lazy,
  headers,
  body,
  subscribeMethods,
  mergeState,
}) => {
  const rawUrl = useExpression(url);

  const [sucessEvent, failureEvent, hookId] = useMemo(() => {
    const nid = nanoid();
    return [`${nid}.success`, `${nid}.error`, nid];
  }, []);

  if (lazy === undefined) {
    lazy = method.toLowerCase() !== "get";
  }

  const header = new Headers();
  if (headers) {
    for (const key in headers) {
      header.set(key, headers[key]);
    }
  }

  useEffect(() => {
    const responseHandler = (res: Response) => {
      mergeState({
        [name]: res,
      });
    };
    const failureHandler = (res: Response | Error) => {};

    emitter.on(sucessEvent, responseHandler);
    emitter.on(failureEvent, failureHandler);
    if (!lazy) {
      fetch(rawUrl, {
        method,
        headers: header,
        body,
      }).then(
        (res) => {
          emitter.emit(hookId, res);
        },
        (err) => {
          emitter.emit(hookId, err);
        }
      );
    }
  }, []);

  subscribeMethods({
    trigger: () => {
      fetch(rawUrl, {
        method,
        headers: header,
        body,
      }).then(
        (res) => {
          emitter.emit(hookId, res);
        },
        (err) => {
          emitter.emit(hookId, err);
        }
      );
    },
  });
};

const NamePropertySchema = Type.String();
const UrlPropertySchema = Type.String();
const MethodPropertySchema = Type.String();
const LazyPropertySchema = Type.Boolean();
const BodyPropertySchema = Type.Any(); // BodyInit
const HeaderPropertySchema = Type.Record(Type.String(), Type.String());

type FetchTraitSchemaProperty = {
  name: Static<typeof NamePropertySchema>;
  url: Static<typeof UrlPropertySchema>;
  method: Static<typeof MethodPropertySchema>;
  lazy?: Static<typeof LazyPropertySchema>;
  body?: Static<typeof BodyPropertySchema>;
  headers?: Static<typeof HeaderPropertySchema>;
};

export default {
  ...createTrait({
    version: "core/v1",
    metadata: {
      name: "fetch",
      description: "add fetch ability for component",
    },
    spec: {
      properties: [
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
          name: "body",
          ...BodyPropertySchema,
        },
        {
          name: "header",
          ...HeaderPropertySchema,
        },
      ],
      state: {},
      methods: [
        {
          name: "trigger",
        },
      ],
    },
  }),
  impl: useFetchTrait,
};
