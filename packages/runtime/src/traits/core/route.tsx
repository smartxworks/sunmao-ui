import React from "react";
import { createTrait } from "@meta-ui/core";
import { Static, Type } from "@sinclair/typebox";
import { TraitImplementation } from "../../registry";

export const RouterIdPropertySchema = Type.String();

export default {
  ...createTrait({
    version: "core/v1",
    metadata: {
      name: "route",
      description: "mark an element as router-controlled element",
    },
    spec: {
      properties: [
        {
          name: "routerId",
          ...RouterIdPropertySchema,
        },
      ],
      state: {},
      methods: [],
    },
  }),
  impl: () => {
    return {
      props: null,
    };
  },
};
