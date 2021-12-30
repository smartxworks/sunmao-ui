import { Static, Type } from '@sinclair/typebox';
import { implementRuntimeComponent2 } from '../../../utils/buildKit';
import { Switch } from './component';

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

const PropsSchema = Type.Object({
  switchPolicy: Type.Array(
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
  ),
});

export default implementRuntimeComponent2({
  version: 'core/v1',
  metadata: {
    name: 'router',
    displayName: 'Router',
    description: 'create a router-controlled component',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {
      switchPolicy: [],
    },
    exampleSize: [6, 6],
  },
  spec: {
    properties: PropsSchema,
    state: Type.Object({}),
    methods: {},
    // route slots are dynamic
    slots: [],
    styleSlots: [],
    events: [],
  },
})(({ slotsMap, switchPolicy, subscribeMethods, mergeState }) => {
  return (
    <Switch
      slotMap={slotsMap}
      switchPolicy={switchPolicy}
      subscribeMethods={subscribeMethods}
      mergeState={mergeState}
    ></Switch>
  );
});
