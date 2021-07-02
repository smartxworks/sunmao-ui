import { JSONSchema4 } from "json-schema";

export type MethodSchema = {
  name: string;
  parameters?: JSONSchema4;
};
