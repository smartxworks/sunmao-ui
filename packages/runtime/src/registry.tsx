import React from 'react';
import { RuntimeComponent, RuntimeTrait } from '@meta-ui/core';
import { SlotsMap } from './App';
// components
/* --- plain --- */
import PlainButton from './components/plain/Button';
import CoreText from './components/core/Text';
import CoreGridLayout from './components/core/GridLayout';
/* --- chakra-ui --- */
import ChakraUIRoot from './components/chakra-ui/Root';
import ChakraUIButton from './components/chakra-ui/Button';
import ChakraUITabs from './components/chakra-ui/Tabs';
import ChakraUITable from './components/chakra-ui/Table';
import ChakraUIInput from './components/chakra-ui/Input';
import ChakraUIBox from './components/chakra-ui/Box';
import ChakraUIKbd from './components/chakra-ui/Kbd';
import ChakraUINumberInput from './components/chakra-ui/NumberInput';
import ChakraUICheckbox from './components/chakra-ui/Checkbox';
import ChakraUIStack from './components/chakra-ui/Stack';
import ChakraUIHStack from './components/chakra-ui/HStack';
import ChakraUIVStack from './components/chakra-ui/VStack';
/* --- lab --- */
import LabEditor from './components/lab/Editor';
// traits
import CoreState from './traits/core/state';
import CoreEvent from './traits/core/event';
import CoreSlot from './traits/core/slot';
import CoreHidden from './traits/core/hidden';
import CoreFetch from './traits/core/fetch';
import CoreValidation from './traits/core/validation';

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
type MergeState = (partialState: any) => void;

export type ComponentImplementation<T = any> = React.FC<
  T & {
    mergeState: MergeState;
    subscribeMethods: SubscribeMethods;
    slotsMap: SlotsMap | undefined;
  }
>;

export type TraitImplementation<T = any> = (
  props: T & {
    mergeState: MergeState;
    subscribeMethods: SubscribeMethods;
  }
) => {
  props: any;
  component?: React.FC;
};

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
registry.registerComponent(CoreGridLayout);
registry.registerComponent(ChakraUIRoot);
registry.registerComponent(ChakraUIButton);
registry.registerComponent(ChakraUITabs);
registry.registerComponent(ChakraUITable);
registry.registerComponent(ChakraUIInput);
registry.registerComponent(ChakraUIBox);
registry.registerComponent(ChakraUIKbd);
registry.registerComponent(ChakraUINumberInput);
registry.registerComponent(ChakraUICheckbox);
registry.registerComponent(ChakraUIStack);
registry.registerComponent(ChakraUIHStack);
registry.registerComponent(ChakraUIVStack);
registry.registerComponent(LabEditor);

registry.registerTrait(CoreState);
registry.registerTrait(CoreEvent);
registry.registerTrait(CoreSlot);
registry.registerTrait(CoreHidden);
registry.registerTrait(CoreFetch);
registry.registerTrait(CoreValidation);
