import React from "react";
import { createTrait } from "@meta-ui/core";
import { Static, Type } from "@sinclair/typebox";
import { TraitImplementation } from "../../registry";
import { useExpression } from "../../store";

type HiddenProps = {
  hidden: Static<typeof HiddenPropertySchema>;
};

const Hidden: React.FC<HiddenProps> = ({ hidden: _hidden, children }) => {
  const hidden = useExpression(_hidden.toString());
  if (hidden) {
    return null;
  }
  return <>{children}</>;
};

const useHiddenTrait: TraitImplementation<HiddenProps> = ({ hidden }) => {
  return {
    props: null,
    component: (props) => <Hidden {...props} hidden={hidden} />,
  };
};

const HiddenPropertySchema = Type.Union([Type.Boolean(), Type.String()]);

export default {
  ...createTrait({
    version: "core/v1",
    metadata: {
      name: "hidden",
      description: "render component with condition",
    },
    spec: {
      properties: [
        {
          name: "hidden",
          ...HiddenPropertySchema,
        },
      ],
      state: {},
      methods: [],
    },
  }),
  impl: useHiddenTrait,
};
