import { Static } from '@sinclair/typebox';
import { EventHandlerSpec } from '@sunmao-ui/shared';

// out-module components' expression rely on in-module component
export type OutsideExpRelation = {
  componentId: string;
  traitType?: string;
  exp: string;
  key: string;
  valuePath: string;
  relyOn: string;
};

export type OutsideExpRelationWithState = OutsideExpRelation & {
  stateName: string;
};

// in-module components rely on out-module components
export type InsideExpRelation = {
  source: string;
  traitType?: string;
  componentId: string;
  exp: string;
  key: string;
};

export enum RefTreatment {
  'keep' = 'keep',
  'move' = 'move',
  'duplicate' = 'duplicate',
  'ignore' = 'ignore',
}

export type RefTreatmentMap = Record<string, RefTreatment>;

// in-module components call out-module components' method
export type InsideMethodRelation = {
  handler: Static<typeof EventHandlerSpec>;
  source: string;
  target: string;
  event: string;
  method: string;
};
