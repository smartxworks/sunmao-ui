import { Static, Type } from '@sinclair/typebox';
import { implementRuntimeComponent } from '../../../utils/buildKit';
import { Switch } from './component';
import { CORE_VERSION } from '@sunmao-ui/shared';
import React from 'react';

export enum RouteType {
  REDIRECT = 'REDIRECT',
  ROUTE = 'ROUTE',
}

export type SwitchPolicy = Static<typeof SwitchPolicyPropertySpec>;

const SwitchPolicyPropertySpec = Type.Array(
  Type.Object({
    type: Type.Enum(RouteType), // redirect, route
    default: Type.Boolean(), // only the first one with default will be treated as default component;
    path: Type.String(),
    slotId: Type.String(),
    href: Type.Optional(Type.String()), // work for redirect
    strict: Type.Optional(Type.Boolean()),
    exact: Type.Optional(Type.Boolean()),
    sensitive: Type.Optional(Type.Boolean()),
  })
);

const PropsSpec = Type.Object({
  switchPolicy: Type.Array(
    Type.Object({
      type: Type.Enum(RouteType), // redirect, route
      default: Type.Boolean(), // only the first one with default will be treated as default component;
      path: Type.String(),
      slotId: Type.String(),
      href: Type.Optional(Type.String()), // work for redirect
      strict: Type.Optional(Type.Boolean()),
      exact: Type.Optional(Type.Boolean()),
      sensitive: Type.Optional(Type.Boolean()),
    })
  ),
});

export default implementRuntimeComponent({
  version: CORE_VERSION,
  metadata: {
    name: 'router',
    displayName: 'Router',
    description: 'create a router-controlled component',
    exampleProperties: {
      switchPolicy: [],
    },
  },
  spec: {
    properties: PropsSpec,
    state: Type.Object({}),
    methods: {},
    // route slots are dynamic
    slots: {},
    styleSlots: [],
    events: [],
  },
})(props => {
  return <Switch {...props} />;
});
