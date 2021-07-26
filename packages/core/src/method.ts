import { JSONSchema7 } from "json-schema";

export type MethodSchema = {
  name: string;
  parameters?: JSONSchema7;
};
