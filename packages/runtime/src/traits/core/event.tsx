import { useCallback, useEffect, useMemo, useRef } from "react";
import { createTrait } from "@meta-ui/core";
import { Static, Type } from "@sinclair/typebox";
import { debounce, throttle, delay } from "lodash";
import { TraitImplementation } from "../../registry";
import { apiService } from "../../api-service";

const useEventTrait: TraitImplementation<{
  events: Static<typeof EventsPropertySchema>;
}> = ({ events }) => {
  const handlerMap = useRef<Record<string, Array<(parameters?: any) => void>>>(
    {}
  );
  const eventHandler = useCallback((s: { name: string; parameters?: any }) => {
    if (!handlerMap.current[s.name]) {
      // maybe log?
      return;
    }
    handlerMap.current[s.name].forEach((fn) => fn(s.parameters));
  }, []);

  useEffect(() => {
    // tear down previous handlers
    handlerMap.current = {};
    // setup current handlers
    for (const event of events) {
      const handler = () => {
        let disabled = false;
        if (typeof event.disabled === "boolean") {
          disabled = event.disabled;
        }
        if (disabled) {
          return;
        }
        apiService.send("uiMethod", {
          componentId: event.componentId,
          name: event.method.name,
          parameters: event.method.parameters,
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
        eventHandler({
          name: "click",
        });
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
      parameters: Type.Any(),
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
    disabled: Type.Boolean(),
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
