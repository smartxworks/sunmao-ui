import {
  Application,
  ApplicationComponent,
  RuntimeApplication,
  isValidId,
  parseType,
  parseVersion,
} from '@sunmao-ui/core';
import { RuntimeApplicationComponent } from '../types/RuntimeSchema';
export class RuntimeAppSchemaManager {
  private runtimeComponentsCache: Record<string, RuntimeApplicationComponent> = {};
  private componentsCache: Record<string, ApplicationComponent> = {};

  update(schema: Application): RuntimeApplication {
    return {
      ...schema,
      kind: 'Application',
      parsedVersion: parseVersion(schema.version),
      spec: {
        ...schema.spec,
        components: schema.spec.components.map(c => {
          return this.genComponent(c);
        }),
      },
    };
  }

  private genComponent(component: ApplicationComponent): RuntimeApplicationComponent {
    const componentInCache = this.componentsCache[component.id];
    if (componentInCache && componentInCache === component) {
      return this.runtimeComponentsCache[component.id];
    }
    if (!isValidId(component.id)) {
      throw new Error(`Invalid id: "${component.id}"`);
    }
    const componentSchema: RuntimeApplicationComponent = {
      ...component,
      parsedType: parseType(component.type),
      traits: component.traits.map(t => {
        return {
          ...t,
          parsedType: parseType(t.type),
        };
      }),
    };
    this.runtimeComponentsCache[component.id] = componentSchema;
    this.componentsCache[component.id] = component;
    return componentSchema;
  }
}
