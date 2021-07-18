import React from "react";
import { RuntimeComponent, RuntimeTrait } from "@meta-ui/core";
import { setStore } from "./store";
// components
import PlainButton from "./components/plain/Button";
import CoreText from "./components/core/Text";
import ChakraUIButton from "./components/chakra-ui/Button";
// traits
import CoreState from "./traits/core/state";
import CoreEvent from "./traits/core/event";

type ImplementedRuntimeComponent = RuntimeComponent & {
  impl: ComponentImplementation;
};

type ImplementedRuntimeTrait = RuntimeTrait & {
  impl: TraitImplementation;
};

type SubscribeMethods = <U>(
  map: {
    [K in keyof U]: (parameters: U[K]) => void;
  }
) => void;
type MergeState = (partialState: Parameters<typeof setStore>[0]) => void;

export type ComponentImplementation<T = any> = React.FC<
  T & {
    mergeState: MergeState;
    subscribeMethods: SubscribeMethods;
  }
>;

export type TraitImplementation<T = any> = (
  props: T & {
    mergeState: MergeState;
    subscribeMethods: SubscribeMethods;
  }
) => any;

class Registry {
  components: Map<string, Map<string, ImplementedRuntimeComponent>> = new Map();
  traits: Map<string, Map<string, ImplementedRuntimeTrait>> = new Map();

  registerComponent(c: ImplementedRuntimeComponent) {
    if (this.components.get(c.version)?.has(c.metadata.name)) {
      throw new Error(
        `Already has component ${c.version}/${c.metadata.name} in this registry.`
      );
    }
    if (!this.components.has(c.version)) {
      this.components.set(c.version, new Map());
    }
    this.components.get(c.version)!.set(c.metadata.name, c);
  }

  getComponent(version: string, name: string): ImplementedRuntimeComponent {
    const c = this.components.get(version)?.get(name);
    if (!c) {
      throw new Error(`Component ${version}/${name} has not registered yet.`);
    }
    return c;
  }

  registerTrait(t: ImplementedRuntimeTrait) {
    if (this.traits.get(t.version)?.has(t.metadata.name)) {
      throw new Error(
        `Already has trait ${t.version}/${t.metadata.name} in this registry.`
      );
    }
    if (!this.traits.has(t.version)) {
      this.traits.set(t.version, new Map());
    }
    this.traits.get(t.version)!.set(t.metadata.name, t);
  }

  getTrait(version: string, name: string): ImplementedRuntimeTrait {
    const t = this.traits.get(version)?.get(name);
    if (!t) {
      throw new Error(`Trait ${version}/${name} has not registered yet.`);
    }
    return t;
  }
}

export const registry = new Registry();

registry.registerComponent(PlainButton);
registry.registerComponent(CoreText);
registry.registerComponent(ChakraUIButton);

registry.registerTrait(CoreState);
registry.registerTrait(CoreEvent);
