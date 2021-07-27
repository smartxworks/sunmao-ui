import { useEffect, useMemo, useRef } from "react";
import { createTrait } from "@meta-ui/core";
import { Static, Type } from "@sinclair/typebox";
import { nanoid } from "nanoid";
import { debounce, throttle, delay } from "lodash";
import { TraitImplementation } from "../../registry";
import { emitter, evalInContext, useStore } from "../../store";

const useEventTrait: TraitImplementation<{
  events: Static<typeof EventsPropertySchema>;
}> = ({ events }) => {
  const hookId = useMemo(() => {
    return nanoid();
  }, []);
  const handlerMap = useRef<Record<string, Array<(parameters?: any) => void>>>(
    {}
  );
  useEffect(() => {
    const handler = (s: { name: string; parameters?: any }) => {
      if (!handlerMap.current[s.name]) {
        // maybe log?
        return;
      }
      handlerMap.current[s.name].forEach((fn) => fn(s.parameters));
    };
    emitter.on(hookId, handler);
    return () => {
      emitter.off(hookId, handler);
    };
  }, []);

  useEffect(() => {
    // tear down previous handlers
    handlerMap.current = {};
    // setup current handlers
    for (const event of events) {
      const handler = () => {
        let disabled = false;
        const currentStoreState = useStore.getState();
        if (typeof event.disabled === "boolean") {
          disabled = event.disabled;
        } else if (typeof event.disabled === "string") {
          disabled = evalInContext(event.disabled, currentStoreState);
        }
        if (disabled) {
          return;
        }
        emitter.emit(event.componentId, {
          name: event.method.name,
          parameters: evalInContext(event.method.parameters, currentStoreState),
        });
      };
      if (!handlerMap.current[event.event]) {
        handlerMap.current[event.event] = [];
      }
      handlerMap.current[event.event].push(
        event.wait.type === "debounce"
          ? debounce(handler, event.wait.time)
          : event.wait.type === "throttle"
          ? throttle(handler, event.wait.time)
          : event.wait.type === "delay"
          ? () => delay(handler, event.wait.time)
          : handler
      );
    }
  }, [events]);

  const hub = useMemo(() => {
    return {
      // HARDCODE
      onClick() {
        emitter.emit(hookId, { name: "click" });
      },
    };
  }, []);

  return {
    props: hub,
  };
};

const EventsPropertySchema = Type.Array(
  Type.Object({
    event: Type.String(),
    componentId: Type.String(),
    method: Type.Object({
      name: Type.String(),
      parameters: Type.String(),
    }),
    wait: Type.Object({
      type: Type.KeyOf(
        Type.Object({
          debounce: Type.String(),
          throttle: Type.String(),
          delay: Type.String(),
        })
      ),
      time: Type.Number(),
    }),
    disabled: Type.Union([Type.Boolean(), Type.String()]),
  })
);

export default {
  ...createTrait({
    version: "core/v1",
    metadata: {
      name: "event",
      description: "export component events with advance features",
    },
    spec: {
      properties: [
        {
          name: "events",
          ...EventsPropertySchema,
        },
      ],
      state: {},
      methods: [],
    },
  }),
  impl: useEventTrait,
};
