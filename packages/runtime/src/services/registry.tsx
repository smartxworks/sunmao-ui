import {
  RuntimeComponentSpec,
  RuntimeTraitSpec,
  RuntimeModuleSpec,
  ApplicationComponent,
} from '@sunmao-ui/core';
// components
/* --- plain --- */
import PlainButton from '../components/plain/Button';
import CoreText from '../components/core/Text';
import CoreGridLayout from '../components/core/GridLayout';
import CoreRouter from '../components/core/Router';
import CoreDummy from '../components/core/Dummy';
import CoreModuleContainer from '../components/core/ModuleContainer';
/* --- chakra-ui --- */
import ChakraUIRoot from '../components/chakra-ui/Root';
import ChakraUIButton from '../components/chakra-ui/Button';
import ChakraUITabs from '../components/chakra-ui/Tabs';
import ChakraUITable from '../components/chakra-ui/Table';
import ChakraUIInput from '../components/chakra-ui/Input';
import ChakraUIBox from '../components/chakra-ui/Box';
import ChakraUIDivider from '../components/chakra-ui/Divider';
import ChakraUIFormControl from '../components/chakra-ui/Form/FormControl';
import ChakraUIForm from '../components/chakra-ui/Form/Form';
import ChakraUIKbd from '../components/chakra-ui/Kbd';
import ChakraUIList from '../components/chakra-ui/List';
import ChakraUILink from '../components/chakra-ui/Link';
import ChakraUINumberInput from '../components/chakra-ui/NumberInput';
import ChakraUIMultiSelect from '../components/chakra-ui/MultiSelect';
import ChakraUICheckboxGroup from '../components/chakra-ui/CheckboxGroup';
import ChakraUICheckbox from '../components/chakra-ui/Checkbox';
import ChakraUIStack from '../components/chakra-ui/Stack';
import ChakraUITooltip from '../components/chakra-ui/Tooltip';
import ChakraUIHStack from '../components/chakra-ui/HStack';
import ChakraUIVStack from '../components/chakra-ui/VStack';
import ChakraUIImage from '../components/chakra-ui/Image';
import ChakraUIDialog from '../components/chakra-ui/Dialog';
import ChakraUISelect from '../components/chakra-ui/Select';
import ChakraUIRadioGroup from '../components/chakra-ui/RadioGroup';
import ChakraUIRadio from '../components/chakra-ui/Radio';

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
} from 'src/types/RuntimeSchema';
import { parseType } from '../utils/parseType';
import { parseModuleSchema } from '../utils/parseModuleSchema';
import { cloneDeep } from 'lodash';

export type ComponentImplementation<T = any> = React.FC<T & ComponentImplementationProps>;

export type ImplementedRuntimeComponent = RuntimeComponentSpec & {
  impl: ComponentImplementation;
};

export type ImplementedRuntimeTrait = RuntimeTraitSpec & {
  impl: TraitImplementation;
};

export type ImplementedRuntimeModule = RuntimeModuleSpec & {
  components: ApplicationComponent[];
};

export class Registry {
  components: Map<string, Map<string, ImplementedRuntimeComponent>> = new Map();
  traits: Map<string, Map<string, ImplementedRuntimeTrait>> = new Map();
  modules: Map<string, Map<string, ImplementedRuntimeModule>> = new Map();

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

  registerModule(c: ImplementedRuntimeModule, overWrite = false) {
    const parsedModule = parseModuleSchema(cloneDeep(c))
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
}

export function initRegistry(): Registry {
  const registry = new Registry();
  registry.registerComponent(PlainButton);
  registry.registerComponent(CoreText);
  registry.registerComponent(CoreGridLayout);
  registry.registerComponent(ChakraUIRoot);
  registry.registerComponent(ChakraUIButton);
  registry.registerComponent(ChakraUITabs);
  registry.registerComponent(ChakraUITable);
  registry.registerComponent(ChakraUIInput);
  registry.registerComponent(ChakraUIBox);
  registry.registerComponent(ChakraUIDivider);
  registry.registerComponent(ChakraUIFormControl);
  registry.registerComponent(ChakraUIForm);
  registry.registerComponent(ChakraUIKbd);
  registry.registerComponent(ChakraUIList);
  registry.registerComponent(ChakraUILink);
  registry.registerComponent(ChakraUIMultiSelect);
  registry.registerComponent(ChakraUINumberInput);
  registry.registerComponent(ChakraUICheckbox);
  registry.registerComponent(ChakraUICheckboxGroup);
  registry.registerComponent(ChakraUIStack);
  registry.registerComponent(ChakraUITooltip);
  registry.registerComponent(ChakraUIHStack);
  registry.registerComponent(ChakraUIVStack);
  registry.registerComponent(ChakraUIImage);
  registry.registerComponent(ChakraUIDialog);
  registry.registerComponent(ChakraUISelect);
  registry.registerComponent(ChakraUIRadioGroup);
  registry.registerComponent(ChakraUIRadio);
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
