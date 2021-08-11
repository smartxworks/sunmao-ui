import React, { useState, useEffect } from "react";
import { createComponent } from "@meta-ui/core";
import { Static, Type } from "@sinclair/typebox";
import { CheckboxGroup as BaseCheckboxGroup } from "@chakra-ui/react";
import { ComponentImplementation } from "../../registry";
import Slot from "../_internal/Slot";
import {
  ColorSchemePropertySchema,
  SizePropertySchema,
  IsDisabledSchema,
} from "./Checkbox";

const DefaultValueSchema = Type.Optional(
  Type.Array(Type.Union([Type.String(), Type.Number()]))
);

const CheckboxGroup: ComponentImplementation<{
  colorScheme?: Static<typeof ColorSchemePropertySchema>;
  size?: Static<typeof SizePropertySchema>;
  defaultValue?: Static<typeof DefaultValueSchema>;
  isDisabled?: Static<typeof IsDisabledSchema>;
}> = ({
  colorScheme,
  size,
  defaultValue,
  isDisabled,
  slotsMap,
  mergeState,
}) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    mergeState({ value });
  }, [value]);

  return (
    <BaseCheckboxGroup
      colorScheme={colorScheme}
      size={size}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      onChange={(val) => setValue(val)}
    >
      <Slot slotsMap={slotsMap} slot="content" />
    </BaseCheckboxGroup>
  );
};

export default {
  ...createComponent({
    version: "chakra_ui/v1",
    metadata: {
      name: "checkbox_group",
      description: "chakra-ui checkbox group",
    },
    spec: {
      properties: [
        {
          name: "colorScheme",
          ...ColorSchemePropertySchema,
        },
        {
          name: "size",
          ...SizePropertySchema,
        },
        {
          name: "isDisabled",
          ...IsDisabledSchema,
        },
        {
          name: "defaultValue",
          ...DefaultValueSchema,
        },
      ],
      acceptTraits: [],
      state: {},
      methods: [],
    },
  }),
  impl: CheckboxGroup,
};
