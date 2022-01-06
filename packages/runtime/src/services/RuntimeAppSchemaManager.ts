import {
  Application,
  ComponentSchema,
  RuntimeApplication,
  isValidId,
  parseType,
  parseVersion,
  RuntimeComponentSchema,
} from '@sunmao-ui/core';
export class RuntimeAppSchemaManager {
  private runtimeComponentsCache: Record<string, RuntimeComponentSchema> = {};
  private componentsCache: Record<string, ComponentSchema> = {};

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

  genComponent(component: ComponentSchema): RuntimeComponentSchema {
    const componentInCache = this.componentsCache[component.id];
    if (componentInCache && componentInCache === component) {
      return this.runtimeComponentsCache[component.id];
    }
    if (!isValidId(component.id)) {
      throw new Error(`Invalid id: "${component.id}"`);
    }
    const componentSchema: RuntimeComponentSchema = {
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
