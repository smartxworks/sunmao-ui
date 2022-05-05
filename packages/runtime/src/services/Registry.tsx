import { parseType } from '@sunmao-ui/core';
// components
/* --- core --- */
import CoreText from '../components/core/Text';
import CoreGridLayout from '../components/core/GridLayout';
import CoreRouter from '../components/core/Router';
import CoreDummy from '../components/core/Dummy';
import CoreModuleContainer from '../components/core/ModuleContainer';
import CoreStack from '../components/core/Stack';
import CoreFileInput from '../components/core/FileInput';

// traits
import CoreArrayState from '../traits/core/ArrayState';
import CoreState from '../traits/core/State';
import CoreEvent from '../traits/core/Event';
import CoreSlot from '../traits/core/Slot';
import CoreStyle from '../traits/core/Style';
import CoreHidden from '../traits/core/Hidden';
import CoreFetch from '../traits/core/Fetch';
import CoreValidation from '../traits/core/Validation';
import CoreLocalStorage from '../traits/core/LocalStorage';
import CoreTransformer from '../traits/core/Transformer';
// utilMethods
import ScrollIntoComponentUtilMethod from '../utilMethods/ScrollIntoComponent';

import {
  ImplementedRuntimeComponent,
  ImplementedRuntimeTraitFactory,
  ImplementedRuntimeTrait,
  ImplementedRuntimeModule,
  UIServices,
} from '../types';
import { UtilMethod } from '../types/utilMethod';
import { UtilMethodManager } from './UtilMethodManager';

export type UtilMethodFactory = () => UtilMethod<any>[];

export type SunmaoLib = {
  components?: ImplementedRuntimeComponent<string, string, string, string>[];
  traits?: ImplementedRuntimeTraitFactory[];
  modules?: ImplementedRuntimeModule[];
  utilMethods?: UtilMethodFactory[];
};

type AnyImplementedRuntimeComponent = ImplementedRuntimeComponent<
  string,
  string,
  string,
  string
>;
export class Registry {
  components = new Map<string, Map<string, AnyImplementedRuntimeComponent>>();
  traits = new Map<string, Map<string, ImplementedRuntimeTrait>>();
  modules = new Map<string, Map<string, ImplementedRuntimeModule>>();
  utilMethods = new Map<string, UtilMethod<any>>();
  private services: UIServices;

  constructor(
    services: Omit<UIServices, 'registry'>,
    private utilMethodManager: UtilMethodManager
  ) {
    this.services = { ...services, registry: this };
  }

  registerComponent(c: AnyImplementedRuntimeComponent) {
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

  getComponent(version: string, name: string): AnyImplementedRuntimeComponent {
    const c = this.components.get(version)?.get(name);
    if (!c) {
      throw new Error(`Component ${version}/${name} has not registered yet.`);
    }
    return c;
  }

  getComponentByType(type: string): AnyImplementedRuntimeComponent {
    const { version, name } = parseType(type);
    return this.getComponent(version, name);
  }

  getAllComponents(): AnyImplementedRuntimeComponent[] {
    const res: AnyImplementedRuntimeComponent[] = [];
    for (const version of this.components.values()) {
      for (const component of version.values()) {
        res.push(component);
      }
    }
    return res;
  }

  registerTrait(t: ImplementedRuntimeTraitFactory) {
    if (this.traits.get(t.version)?.has(t.metadata.name)) {
      throw new Error(
        `Already has trait ${t.version}/${t.metadata.name} in this registry.`
      );
    }
    if (!this.traits.has(t.version)) {
      this.traits.set(t.version, new Map());
    }
    const trait = {
      ...t,
      impl: t.factory(),
    };
    this.traits.get(t.version)?.set(t.metadata.name, trait);
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
    if (!overWrite && this.modules.get(c.version)?.has(c.metadata.name)) {
      throw new Error(
        `Already has module ${c.version}/${c.metadata.name} in this registry.`
      );
    }
    if (!this.modules.has(c.version)) {
      this.modules.set(c.version, new Map());
    }
    this.modules.get(c.version)?.set(c.metadata.name, c);
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

  unregisterAllModules() {
    this.modules = new Map<string, Map<string, ImplementedRuntimeModule>>();
  }

  registerUtilMethod<T>(m: UtilMethod<T>) {
    if (this.utilMethods.get(m.name)) {
      throw new Error(`Already has utilMethod ${m.name} in this registry.`);
    }
    this.utilMethods.set(m.name, m);
    this.utilMethodManager.listenUtilMethod(m, this.services);
  }

  installLib(lib: SunmaoLib) {
    lib.components?.forEach(c => this.registerComponent(c));
    lib.traits?.forEach(t => this.registerTrait(t));
    lib.modules?.forEach(m => this.registerModule(m));
    if (lib.utilMethods) {
      lib.utilMethods.forEach(factory => {
        const methods = factory();
        methods.forEach(m => this.registerUtilMethod(m));
      });
    }
  }
}

export function initRegistry(
  services: Omit<UIServices, 'registry'>,
  utilMethodManager: UtilMethodManager
): Registry {
  const registry = new Registry(services, utilMethodManager);
  registry.registerComponent(CoreText);
  registry.registerComponent(CoreGridLayout);
  registry.registerComponent(CoreRouter);
  registry.registerComponent(CoreDummy);
  registry.registerComponent(CoreModuleContainer);
  registry.registerComponent(CoreStack);
  registry.registerComponent(CoreFileInput);

  registry.registerTrait(CoreState);
  registry.registerTrait(CoreArrayState);
  registry.registerTrait(CoreEvent);
  registry.registerTrait(CoreSlot);
  registry.registerTrait(CoreStyle);
  registry.registerTrait(CoreHidden);
  registry.registerTrait(CoreFetch);
  registry.registerTrait(CoreValidation);
  registry.registerTrait(CoreLocalStorage);
  registry.registerTrait(CoreTransformer);

  registry.registerUtilMethod(ScrollIntoComponentUtilMethod);

  return registry;
}
