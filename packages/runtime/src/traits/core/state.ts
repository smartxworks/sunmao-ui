import { useEffect } from "react";
import { createTrait } from "@meta-ui/core";
import { TraitImplementation } from "../../registry";

const useStateTrait: TraitImplementation<{
  key: string;
  initialValue: any;
}> = ({ key, initialValue, mergeState, subscribeMethods }) => {
  useEffect(() => {
    mergeState({ [key]: initialValue });

    subscribeMethods({
      setValue(value) {
        mergeState({ [key]: value });
      },
      reset() {
        mergeState({ [key]: initialValue });
      },
    });
  }, []);
};

export default {
  ...createTrait({
    version: "core/v1",
    metadata: {
      name: "state",
      description: "add state to component",
    },
    spec: {
      properties: [
        {
          name: "key",
          type: "string",
        },
        {
          name: "initialValue",
          type: "any",
        },
      ],
      state: {
        type: "any",
      },
      methods: [
        {
          name: "setValue",
          parameters: {
            type: "any",
          },
        },
        {
          name: "reset",
        },
      ],
    },
  }),
  impl: useStateTrait,
};
