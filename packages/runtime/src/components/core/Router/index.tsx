import { Static, Type } from '@sinclair/typebox';
import React from 'react';
import { createComponent } from '@meta-ui/core';
import { ComponentImplementation } from '../../../registry';
import { Switch } from './component';
import { useRouter } from './hooks';

const Router: ComponentImplementation<{
  switchPolicy: Static<typeof SwitchPolicyPropertySchema>;
  nested?: boolean;
}> = ({ slotsMap, switchPolicy, subscribeMethods, mergeState }) => {
  return (
    <Switch
      slotMap={slotsMap}
      switchPolicy={switchPolicy}
      subscribeMethods={subscribeMethods}
      mergeState={mergeState}></Switch>
  );
};

export enum RouteType {
  REDIRECT = 'REDIRECT',
  ROUTE = 'ROUTE',
}

export type SwitchPolicy = Static<typeof SwitchPolicyPropertySchema>;

const SwitchPolicyPropertySchema = Type.Array(
  Type.Object({
    type: Type.Enum(RouteType), // redirect, route
    default: Type.Boolean(), //only the first one with default will be treated as default component;
    path: Type.String(),
    slotId: Type.String(),
    href: Type.Optional(Type.String()), // work for redirect
    strict: Type.Optional(Type.Boolean()),
    exact: Type.Optional(Type.Boolean()),
    sensitive: Type.Optional(Type.Boolean()),
  })
);

export default {
  ...createComponent({
    version: 'core/v1',
    metadata: {
      name: 'router',
      description: 'create a router-controlled component',
    },
    spec: {
      properties: [
        {
          name: 'switchPolicy',
          ...SwitchPolicyPropertySchema,
        },
      ],
      acceptTraits: [],
      state: {},
      methods: [],
    },
  }),
  impl: Router,
};
