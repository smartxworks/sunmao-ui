import { ImplementedRuntimeModule } from '../services/registry';

// add {{$moduleId}} in moduleSchema
export function parseModuleSchema(module: ImplementedRuntimeModule): ImplementedRuntimeModule {
  const ids = module.components.map(c => c.id);
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

  return module
}
