import React, { useEffect } from "react";
import { Table as BaseTable, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";
import { ComponentImplementation } from "../../registry";
import { createComponent } from "@meta-ui/core";
import { Static, Type } from "@sinclair/typebox";

function normalizeData(data: Static<typeof DataPropertySchema>): {
  normalizedData: Array<Record<string, string>>;
  keys: string[];
} {
  const normalizedData: Array<Record<string, string>> = [];
  const keys = new Set<string>();
  for (const item of data) {
    if (typeof data !== "object") {
      normalizedData.push({});
    } else {
      normalizedData.push(item);
      Object.keys(item).forEach((key) => keys.add(key));
    }
  }
  return {
    normalizedData,
    keys: Array.from(keys),
  };
}

const Table: ComponentImplementation<{
  data: Static<typeof DataPropertySchema>;
  size: Static<typeof SizePropertySchema>;
}> = ({ data, size, mergeState }) => {
  const { normalizedData, keys } = normalizeData(data);
  useEffect(() => {
    mergeState({ data });
  }, [data]);

  return (
    <BaseTable size={size}>
      <Thead>
        <Tr>
          {keys.map((key) => (
            <Th key={key}>{key}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {normalizedData.map((item, idx) => {
          return (
            <Tr key={idx}>
              {keys.map((key) => (
                <Td key={key}>{item[key] ?? "-"}</Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </BaseTable>
  );
};

const DataPropertySchema = Type.Array(Type.Any());
const SizePropertySchema = Type.KeyOf(
  Type.Object({
    sm: Type.String(),
    md: Type.String(),
    lg: Type.String(),
  })
);

const StateSchema = Type.Object({
  data: Type.Array(Type.Any()),
});

export default {
  ...createComponent({
    version: "chakra_ui/v1",
    metadata: {
      name: "table",
      description: "chakra-ui table",
    },
    spec: {
      properties: [
        {
          name: "data",
          ...DataPropertySchema,
        },
        {
          name: "size",
          ...SizePropertySchema,
        },
      ],
      acceptTraits: [],
      state: StateSchema,
      methods: [],
    },
  }),
  impl: Table,
};
