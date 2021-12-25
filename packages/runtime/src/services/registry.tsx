import {
  RuntimeComponentSpec,
  RuntimeTraitSpec,
  RuntimeModuleSpec,
  ApplicationComponent,
} from '@sunmao-ui/core';
// components
/* --- plain --- */
// import PlainButton from '../components/plain/Button';
import CoreText from '../components/core/Text';
import CoreGridLayout from '../components/core/GridLayout';
import CoreRouter from '../components/core/Router';
import CoreDummy from '../components/core/Dummy';
import CoreModuleContainer from '../components/core/ModuleContainer';

// traits
import CoreArrayState from '../traits/core/arrayState';
import CoreState from '../traits/core/state';
import CoreEvent from '../traits/core/event';
import CoreSlot from '../traits/core/slot';
import CoreStyle from '../traits/core/style';
import CoreHidden from '../traits/core/hidden';
import CoreFetch from '../traits/core/fetch';
import CoreValidation from '../traits/core/validation';
import {
  ComponentImplementationProps,
  TraitImplementation,
} from '../types/RuntimeSchema';
import { parseType } from '../utils/parseType';
import { parseModuleSchema } from '../utils/parseModuleSchema';
import { cloneDeep } from 'lodash-es';

export type ComponentImplementation<
  TProps = any,
  TState = any,
  TMethods = Record<string, any>,
  KSlot extends string = string,
  KStyleSlot extends string = string,
  KEvent extends string = string
> = React.FC<
  TProps & ComponentImplementationProps<TState, TMethods, KSlot, KStyleSlot, KEvent>
>;

export type ImplementedRuntimeComponent = RuntimeComponentSpec & {
  impl: ComponentImplementation;
};

export type ImplementedRuntimeTrait = RuntimeTraitSpec & {
  impl: TraitImplementation;
};

export type ImplementedRuntimeModule = RuntimeModuleSpec & {
  impl: ApplicationComponent[];
};

export type SunmaoLib = {
  components?: ImplementedRuntimeComponent[];
  traits?: ImplementedRuntimeTrait[];
  modules?: ImplementedRuntimeModule[];
};

export class Registry {
  components = new Map<string, Map<string, ImplementedRuntimeComponent>>();
  traits = new Map<string, Map<string, ImplementedRuntimeTrait>>();
  modules = new Map<string, Map<string, ImplementedRuntimeModule>>();

  registerComponent(c: ImplementedRuntimeComponent) {
    if (this.components.get(c.version)?.has(c.metadata.name)) {
      throw new Error(
        `Already has component ${c.version}/${c.metadata.name} in this registry.`
      );
    }
    if (!this.components.has(c.version)) {
      this.components.set(c.version, new Map());
    }
    this.components.get(c.version)?.set(c.metadata.name, c);
  }

  getComponent(version: string, name: string): ImplementedRuntimeComponent {
    const c = this.components.get(version)?.get(name);
    if (!c) {
      throw new Error(`Component ${version}/${name} has not registered yet.`);
    }
    return c;
  }

  getComponentByType(type: string): ImplementedRuntimeComponent {
    const { version, name } = parseType(type);
    return this.getComponent(version, name);
  }

  getAllComponents(): ImplementedRuntimeComponent[] {
    const res: ImplementedRuntimeComponent[] = [];
    for (const version of this.components.values()) {
      for (const component of version.values()) {
        res.push(component);
      }
    }
    return res;
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
    this.traits.get(t.version)?.set(t.metadata.name, t);
  }

  getTrait(version: string, name: string): ImplementedRuntimeTrait {
    const t = this.traits.get(version)?.get(name);
    if (!t) {
      throw new Error(`Trait ${version}/${name} has not registered yet.`);
    }
    return t;
  }

  getTraitByType(type: string): ImplementedRuntimeTrait {
    const { version, name } = parseType(type);
    return this.getTrait(version, name);
  }

  getAllTraitTypes(): string[] {
    const res: string[] = [];
    for (const version of this.traits.keys()) {
      for (const name of this.traits.get(version)!.keys()) {
        res.push(`${version}/${name}`);
      }
    }
    return res;
  }

  getAllTraits(): ImplementedRuntimeTrait[] {
    const res: ImplementedRuntimeTrait[] = [];
    for (const version of this.traits.values()) {
      for (const trait of version.values()) {
        res.push(trait);
      }
    }
    return res;
  }

  registerModule(c: ImplementedRuntimeModule, overWrite = false) {
    const parsedModule = parseModuleSchema(cloneDeep(c));
    if (!overWrite && this.modules.get(c.version)?.has(c.metadata.name)) {
      throw new Error(
        `Already has module ${c.version}/${c.metadata.name} in this registry.`
      );
    }
    if (!this.modules.has(c.version)) {
      this.modules.set(c.version, new Map());
    }
    this.modules.get(c.version)?.set(c.metadata.name, parsedModule);
  }

  getModule(version: string, name: string): ImplementedRuntimeModule {
    const m = this.modules.get(version)?.get(name);
    if (!m) {
      throw new Error(`Module ${version}/${name} has not registered yet.`);
    }
    return m;
  }

  getModuleByType(type: string): ImplementedRuntimeModule {
    const { version, name } = parseType(type);
    return this.getModule(version, name);
  }

  installLib(lib: SunmaoLib) {
    lib.components?.forEach(c => this.registerComponent(c));
    lib.traits?.forEach(t => this.registerTrait(t));
    lib.modules?.forEach(m => this.registerModule(m));
  }
}

export function initRegistry(): Registry {
  const registry = new Registry();
  // TODO: (type-safe) register v2 component
  // registry.registerComponent(PlainButton);
  registry.registerComponent(CoreText);
  registry.registerComponent(CoreGridLayout);
  registry.registerComponent(CoreRouter);
  registry.registerComponent(CoreDummy);
  registry.registerComponent(CoreModuleContainer);

  registry.registerTrait(CoreState);
  registry.registerTrait(CoreArrayState);
  registry.registerTrait(CoreEvent);
  registry.registerTrait(CoreSlot);
  registry.registerTrait(CoreStyle);
  registry.registerTrait(CoreHidden);
  registry.registerTrait(CoreFetch);
  registry.registerTrait(CoreValidation);

  return registry;
}
