import { Version } from '../../core/typings/version';
import { apiService } from './api-service';

export function mountUtilMethods() {
  apiService.on('uiMethod', ({ componentId, name, parameters }) => {
    if (componentId !== '$utils') {
      return;
    }

    switch (name) {
      case 'alert':
        window.alert(parameters);
        break;
      default:
        break;
    }
  });
}

// parse component Type
export function parseType(v: string) {
  const TYPE_REG = /^([a-zA-Z0-9_\d]+\/[a-zA-Z0-9_\d]+)\/([a-zA-Z0-9_\d]+)$/;
  function isValidType(v: string): boolean {
    return TYPE_REG.test(v);
  }
  if (!isValidType(v)) {
    throw new Error(`Invalid type string: "${v}"`);
  }

  const [, version, name] = v.match(TYPE_REG)!;
  return {
    version,
    name,
  };
}
