import { createTrait } from "@meta-ui/core";
import { Type } from "@sinclair/typebox";

export const ContainerPropertySchema = Type.Object({
  id: Type.String(),
  slot: Type.String(),
});

export default {
  ...createTrait({
    version: "core/v1",
    metadata: {
      name: "slot",
      description: "nested components by slots",
    },
    spec: {
      properties: [
        {
          name: "container",
          ...ContainerPropertySchema,
        },
      ],
      state: {},
      methods: [],
    },
  }),
  impl: () => ({
    props: null,
  }),
};
