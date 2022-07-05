import { Condition } from '@sunmao-ui/shared';

declare module '@sinclair/typebox' {
  export interface CustomOptions {
    defaultValue?: any;
    // category
    category?: string;
    weight?: number;
    name?: string;
    // conditional render
    conditions?: Condition[];
    // is a reference of component id
    isComponentId?: boolean;
  }
}
