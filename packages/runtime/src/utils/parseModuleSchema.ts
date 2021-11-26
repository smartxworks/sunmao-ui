import { ImplementedRuntimeModule } from '../services/registry';

// add {{$moduleId}} in moduleSchema
export function parseModuleSchema(
  module: ImplementedRuntimeModule
): ImplementedRuntimeModule {
  const ids: string[] = [];
  module.components.forEach(c => {
    ids.push(c.id);
    if (c.type === 'core/v1/moduleContainer') {
      ids.push(c.properties.id as string);
    }


    if (c.type === 'chakra_ui/v1/list') {
      ids.push((c.properties.template as any).id);
    }
  });
  function traverse(tree: Record<string, any>) {
    for (const key in tree) {
      const val = tree[key];
      if (typeof val === 'string') {
        if (ids.includes(val)) {
          tree[key] = `{{ $moduleId }}__${val}`;
        } else {
          for (const id of ids) {
            if (val.includes(`${id}.`)) {
              tree[key] = val.replaceAll(`${id}.`, `{{ $moduleId }}__${id}.`);
              break;
            }
          }
        }
      } else if (typeof val === 'object') {
        traverse(val);
      }
    }
  }

  traverse(module.components);

  return module;
}
